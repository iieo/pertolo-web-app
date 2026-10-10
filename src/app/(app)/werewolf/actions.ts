'use server';

import { randomInt } from 'node:crypto';
import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import {
  WerewolfGameModel,
  WerewolfPlayerModel,
  werewolfGamesTable,
  werewolfPlayersTable,
} from '@/db/schema';
import { Result } from '@/util/types';

import { EngineAction, applyAction, startGame as startEngine } from './lib/engine';
import {
  handOverHostIfStale,
  loadPlayers,
  lockGame,
  pickHost,
  saveEngine,
  touchPlayer,
  Tx,
  updateGame,
  toViewSource,
} from './lib/repo';
import {
  MAX_PLAYERS,
  normalizeRoles,
  presetFor,
  Role,
  rolesToList,
  validateRoles,
} from './lib/roles';
import {
  clearToken,
  generateCode,
  newToken,
  normalizeCode,
  readToken,
  writeToken,
} from './lib/session';
import { isAway, toEngineGame } from './lib/view';

const MAX_NAME_LENGTH = 20;

interface Ctx {
  tx: Tx;
  game: WerewolfGameModel;
  players: WerewolfPlayerModel[];
  me: WerewolfPlayerModel;
  now: number;
}

type Versioned = { version: number };

function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

function fail<T>(error: string): Result<T> {
  return { success: false, error };
}

function normalizeName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const name = raw.trim().replace(/\s+/g, ' ');
  return name.length > 0 && name.length <= MAX_NAME_LENGTH ? name : null;
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Runs `fn` for the cookie player inside a transaction holding the game row lock. */
async function withPlayer<T>(
  rawGameId: unknown,
  fn: (ctx: Ctx) => Promise<Result<T>>,
): Promise<Result<T>> {
  const gameId = normalizeCode(rawGameId);
  if (!gameId) return fail('INVALID_CODE');
  const token = await readToken(gameId);
  if (!token) return fail('NOT_JOINED');
  try {
    return await db.transaction(async (tx) => {
      const game = await lockGame(tx, gameId);
      if (!game) return fail<T>('GAME_NOT_FOUND');
      const players = await loadPlayers(tx, gameId);
      const me = players.find((p) => p.token === token);
      if (!me) return fail<T>('NOT_JOINED');
      const nowDate = new Date();
      await touchPlayer(tx, me.id, nowDate);
      me.lastSeenAt = nowDate;
      const now = nowDate.getTime();
      await handOverHostIfStale(tx, game, players, now);
      return fn({ tx, game, players, me, now });
    });
  } catch (error) {
    console.error('[werewolf]', error);
    return fail('SERVER_ERROR');
  }
}

function withHostInLobby<T>(
  rawGameId: unknown,
  fn: (ctx: Ctx) => Promise<Result<T>>,
): Promise<Result<T>> {
  return withPlayer<T>(rawGameId, async (ctx) => {
    if (ctx.game.hostPlayerId !== ctx.me.id) return fail('NOT_HOST');
    if (ctx.game.status !== 'lobby') return fail('NOT_LOBBY');
    return fn(ctx);
  });
}

function engineAction(rawGameId: unknown, action: EngineAction): Promise<Result<Versioned>> {
  return withPlayer<Versioned>(rawGameId, async ({ tx, game, players, me, now }) => {
    if (game.status !== 'playing' || !game.state) return fail('NOT_PLAYING');
    const engine = toEngineGame(toViewSource(game, players, now))!;
    const result = applyAction(
      engine,
      { actorId: me.id, isHost: game.hostPlayerId === me.id, now },
      action,
    );
    if (!result.ok) return fail(result.error);
    return ok({ version: await saveEngine(tx, game.id, players, result.game) });
  });
}

// ─── Lobby ──────────────────────────────────────────────────────────────────

export async function createGame(rawName: string): Promise<Result<{ gameId: string }>> {
  const name = normalizeName(rawName);
  if (!name) return fail('INVALID_NAME');
  try {
    for (let attempt = 0; attempt < 10; attempt++) {
      const gameId = generateCode();
      const token = newToken();
      const created = await db.transaction(async (tx) => {
        const [game] = await tx
          .insert(werewolfGamesTable)
          .values({ id: gameId, status: 'lobby', rolesConfig: presetFor(1) })
          .onConflictDoNothing()
          .returning({ id: werewolfGamesTable.id });
        if (!game) return false;
        const [player] = await tx
          .insert(werewolfPlayersTable)
          .values({ gameId, token, name, seat: 1, lastSeenAt: new Date() })
          .returning({ id: werewolfPlayersTable.id });
        await tx
          .update(werewolfGamesTable)
          .set({ hostPlayerId: player.id })
          .where(eq(werewolfGamesTable.id, gameId));
        return true;
      });
      if (created) {
        await writeToken(gameId, token);
        return ok({ gameId });
      }
    }
    return fail('SERVER_ERROR');
  } catch (error) {
    console.error('[werewolf]', error);
    return fail('SERVER_ERROR');
  }
}

/**
 * Joins the lobby, or takes over an existing seat with the same name when that
 * player has been away (30 s in lobby, 120 s once started; rejoin, also after the game started).
 */
export async function joinGame(
  rawGameId: string,
  rawName: string,
): Promise<Result<{ gameId: string }>> {
  const gameId = normalizeCode(rawGameId);
  if (!gameId) return fail('INVALID_CODE');
  const name = normalizeName(rawName);
  if (!name) return fail('INVALID_NAME');
  const existingToken = await readToken(gameId);
  const token = newToken();

  try {
    const result = await db.transaction(async (tx): Promise<Result<{ token: string | null }>> => {
      const game = await lockGame(tx, gameId);
      if (!game) return fail('GAME_NOT_FOUND');
      const players = await loadPlayers(tx, gameId);
      const nowDate = new Date();
      const now = nowDate.getTime();

      const current = existingToken ? players.find((p) => p.token === existingToken) : undefined;
      if (current) {
        await touchPlayer(tx, current.id, nowDate);
        return ok({ token: null });
      }

      const same = players.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (same) {
        if (!isAway(same.lastSeenAt, now, game.status)) return fail('NAME_TAKEN');
        await tx
          .update(werewolfPlayersTable)
          .set({ token, lastSeenAt: nowDate })
          .where(eq(werewolfPlayersTable.id, same.id));
        same.lastSeenAt = nowDate;
        await handOverHostIfStale(tx, game, players, now);
        await updateGame(tx, gameId, {});
        return ok({ token });
      }

      if (game.status !== 'lobby') return fail('GAME_STARTED');
      if (players.length >= MAX_PLAYERS) return fail('GAME_FULL');

      const seat = Math.max(0, ...players.map((p) => p.seat)) + 1;
      const [player] = await tx
        .insert(werewolfPlayersTable)
        .values({ gameId, token, name, seat, lastSeenAt: nowDate })
        .returning();
      players.push(player);
      await handOverHostIfStale(tx, game, players, now);
      await updateGame(
        tx,
        gameId,
        game.rolesCustom ? {} : { rolesConfig: presetFor(players.length) },
      );
      return ok({ token });
    });

    if (!result.success) return result;
    if (result.data.token) await writeToken(gameId, result.data.token);
    return ok({ gameId });
  } catch (error) {
    console.error('[werewolf]', error);
    return fail('SERVER_ERROR');
  }
}

/** `config` null resets to the preset, which then follows the player count again. */
export async function setRoles(
  gameId: string,
  config: Partial<Record<Role, number>> | null,
): Promise<Result<Versioned>> {
  return withHostInLobby<Versioned>(gameId, async ({ tx, game, players }) => {
    if (config === null) {
      const version = await updateGame(tx, game.id, {
        rolesConfig: presetFor(players.length),
        rolesCustom: false,
      });
      return ok({ version });
    }
    const roles = normalizeRoles(config);
    if (!roles) return fail('INVALID_ROLES');
    return ok({
      version: await updateGame(tx, game.id, { rolesConfig: roles, rolesCustom: true }),
    });
  });
}

export async function kickPlayer(gameId: string, playerId: string): Promise<Result<Versioned>> {
  return withHostInLobby<Versioned>(gameId, async ({ tx, game, players, me }) => {
    if (playerId === me.id) return fail('CANNOT_KICK_SELF');
    const target = players.find((p) => p.id === playerId);
    if (!target) return fail('PLAYER_NOT_FOUND');
    await tx.delete(werewolfPlayersTable).where(eq(werewolfPlayersTable.id, target.id));
    const remaining = players.length - 1;
    const version = await updateGame(
      tx,
      game.id,
      game.rolesCustom ? {} : { rolesConfig: presetFor(remaining) },
    );
    return ok({ version });
  });
}

export async function startGame(gameId: string): Promise<Result<Versioned>> {
  return withHostInLobby<Versioned>(gameId, async ({ tx, game, players, now }) => {
    const rolesError = validateRoles(game.rolesConfig, players.length);
    if (rolesError) return fail(rolesError);
    const engine = startEngine(
      players.map((p) => ({ id: p.id, seat: p.seat, role: null, alive: true })),
      shuffle(rolesToList(game.rolesConfig)),
      now,
    );
    return ok({ version: await saveEngine(tx, game.id, players, engine) });
  });
}

/** Back to the lobby with the same players; players who left or went offline are dropped. */
export async function playAgain(gameId: string): Promise<Result<Versioned>> {
  return withPlayer<Versioned>(gameId, async ({ tx, game, players, me, now }) => {
    if (game.hostPlayerId !== me.id) return fail('NOT_HOST');
    if (game.status !== 'finished') return fail('NOT_FINISHED');
    const gone = players.filter((p) => p.id !== me.id && isAway(p.lastSeenAt, now, game.status));
    if (gone.length > 0) {
      await tx.delete(werewolfPlayersTable).where(
        inArray(
          werewolfPlayersTable.id,
          gone.map((p) => p.id),
        ),
      );
    }
    await tx
      .update(werewolfPlayersTable)
      .set({ role: null, isAlive: true })
      .where(eq(werewolfPlayersTable.gameId, game.id));
    const remaining = players.length - gone.length;
    const version = await updateGame(tx, game.id, {
      status: 'lobby',
      state: null,
      ...(game.rolesCustom ? {} : { rolesConfig: presetFor(remaining) }),
    });
    return ok({ version });
  });
}

/**
 * Lobby: removes the player. Running or finished game: keeps the seat but marks
 * it offline, so it can be taken over by name right away.
 */
export async function leaveGame(gameId: string): Promise<Result<{ left: true }>> {
  const result = await withPlayer<{ left: true }>(
    gameId,
    async ({ tx, game, players, me, now }) => {
      const others = players.filter((p) => p.id !== me.id);
      if (game.status === 'lobby' && others.length === 0) {
        await tx.delete(werewolfGamesTable).where(eq(werewolfGamesTable.id, game.id));
        return ok({ left: true as const });
      }
      if (game.status === 'lobby') {
        await tx.delete(werewolfPlayersTable).where(eq(werewolfPlayersTable.id, me.id));
      } else {
        await tx
          .update(werewolfPlayersTable)
          .set({ lastSeenAt: new Date(0) })
          .where(eq(werewolfPlayersTable.id, me.id));
      }
      await updateGame(tx, game.id, {
        ...(game.hostPlayerId === me.id
          ? { hostPlayerId: pickHost(others, null, now, game.status)?.id ?? null }
          : {}),
        ...(game.status === 'lobby' && !game.rolesCustom
          ? { rolesConfig: presetFor(others.length) }
          : {}),
      });
      return ok({ left: true as const });
    },
  );
  const code = normalizeCode(gameId);
  if (code) await clearToken(code);
  if (!result.success && result.error === 'NOT_JOINED') return ok({ left: true });
  return result;
}

// ─── Game ───────────────────────────────────────────────────────────────────

const playerId = z.string().min(1).max(64);

const nullableId = playerId.nullable();
const pair = z.tuple([playerId, playerId]);

const actSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('cupid'), targetIds: pair }),
  z.object({ type: z.literal('wildChild'), targetId: playerId }),
  z.object({ type: z.literal('wander'), targetId: playerId }),
  z.object({ type: z.literal('protect'), targetId: playerId }),
  z.object({ type: z.literal('bless'), targetId: nullableId }),
  z.object({ type: z.literal('see'), targetId: playerId }),
  z.object({ type: z.literal('wolfSee'), targetId: playerId }),
  z.object({ type: z.literal('fox'), targetId: playerId }),
  z.object({ type: z.literal('detect'), targetIds: pair }),
  z.object({ type: z.literal('wolfPick'), targetId: playerId }),
  z.object({ type: z.literal('infect'), targetId: nullableId }),
  z.object({ type: z.literal('bigBadWolf'), targetId: playerId }),
  z.object({ type: z.literal('whiteWolf'), targetId: nullableId }),
  z.object({ type: z.literal('serialKill'), targetId: playerId }),
  z.object({ type: z.literal('witch'), healId: nullableId, poisonId: nullableId }),
  z.object({ type: z.literal('silence'), targetId: playerId }),
  z.object({ type: z.literal('charm'), targetIds: z.array(playerId).min(1).max(2) }),
  z.object({ type: z.literal('hunterShot'), targetId: playerId }),
]);

export type ActAction = z.infer<typeof actSchema>;

export async function ready(gameId: string): Promise<Result<Versioned>> {
  return engineAction(gameId, { type: 'ready' });
}

/** Night actions and the hunter shot. */
export async function act(gameId: string, action: ActAction): Promise<Result<Versioned>> {
  const parsed = actSchema.safeParse(action);
  if (!parsed.success) return fail('INVALID_ACTION');
  return engineAction(gameId, parsed.data);
}

/** `targetId` null abstains. */
export async function vote(gameId: string, targetId: string | null): Promise<Result<Versioned>> {
  const parsed = playerId.nullable().safeParse(targetId);
  if (!parsed.success) return fail('INVALID_ACTION');
  return engineAction(gameId, { type: 'vote', targetId: parsed.data });
}

/** Stuttering judge, once per game during a vote result: starts a second vote right away. */
export async function judge(gameId: string): Promise<Result<Versioned>> {
  return engineAction(gameId, { type: 'judge' });
}

export async function startVote(gameId: string): Promise<Result<Versioned>> {
  return engineAction(gameId, { type: 'startVote' });
}

export async function endVote(gameId: string): Promise<Result<Versioned>> {
  return engineAction(gameId, { type: 'endVote' });
}

/** Host: from the vote result into the next night. */
export async function continueGame(gameId: string): Promise<Result<Versioned>> {
  return engineAction(gameId, { type: 'continue' });
}

/** Host: skip a stuck reveal, night step or hunter shot after 60 s. */
export async function skipStep(gameId: string): Promise<Result<Versioned>> {
  return engineAction(gameId, { type: 'skipStep' });
}
