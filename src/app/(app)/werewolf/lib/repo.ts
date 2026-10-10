import { asc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import {
  WerewolfGameModel,
  WerewolfPlayerModel,
  werewolfGamesTable,
  werewolfPlayersTable,
} from '@/db/schema';

import { EngineGame } from './engine';
import { ViewSource, isAway } from './view';

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Executor = Tx | typeof db;
type GamePatch = Partial<typeof werewolfGamesTable.$inferInsert>;

export async function lockGame(tx: Tx, gameId: string): Promise<WerewolfGameModel | null> {
  const [row] = await tx
    .select()
    .from(werewolfGamesTable)
    .where(eq(werewolfGamesTable.id, gameId))
    .for('update');
  return row ?? null;
}

export async function loadGame(ex: Executor, gameId: string): Promise<WerewolfGameModel | null> {
  const [row] = await ex.select().from(werewolfGamesTable).where(eq(werewolfGamesTable.id, gameId));
  return row ?? null;
}

export async function loadPlayers(ex: Executor, gameId: string): Promise<WerewolfPlayerModel[]> {
  return ex
    .select()
    .from(werewolfPlayersTable)
    .where(eq(werewolfPlayersTable.gameId, gameId))
    .orderBy(asc(werewolfPlayersTable.seat));
}

export async function touchPlayer(ex: Executor, playerId: string, at: Date) {
  await ex
    .update(werewolfPlayersTable)
    .set({ lastSeenAt: at })
    .where(eq(werewolfPlayersTable.id, playerId));
}

/** Writes a game patch and bumps the version. Caller must hold the row lock. */
export async function updateGame(tx: Tx, gameId: string, patch: GamePatch) {
  const [row] = await tx
    .update(werewolfGamesTable)
    .set({ ...patch, version: sql`${werewolfGamesTable.version} + 1` })
    .where(eq(werewolfGamesTable.id, gameId))
    .returning({ version: werewolfGamesTable.version });
  return row.version;
}

/** Persists engine output: changed player roles/alive flags plus state and status. */
export async function saveEngine(
  tx: Tx,
  gameId: string,
  before: WerewolfPlayerModel[],
  next: EngineGame,
) {
  for (const p of next.players) {
    const old = before.find((b) => b.id === p.id);
    if (!old || (old.role === p.role && old.isAlive === p.alive)) continue;
    await tx
      .update(werewolfPlayersTable)
      .set({ role: p.role, isAlive: p.alive })
      .where(eq(werewolfPlayersTable.id, p.id));
  }
  return updateGame(tx, gameId, {
    state: next.state,
    status: next.state.phase === 'end' ? 'finished' : 'playing',
  });
}

/** Next host candidate: lowest seat among connected players, else lowest seat overall. */
export function pickHost(
  players: WerewolfPlayerModel[],
  excludeId: string | null,
  now: number,
  status: WerewolfGameModel['status'],
): WerewolfPlayerModel | null {
  const others = players.filter((p) => p.id !== excludeId).sort((a, b) => a.seat - b.seat);
  return others.find((p) => !isAway(p.lastSeenAt, now, status)) ?? others[0] ?? null;
}

/** Passes the host role on when the host has been away (30 s lobby, 120 s running). Caller holds the lock. */
export async function handOverHostIfStale(
  tx: Tx,
  game: WerewolfGameModel,
  players: WerewolfPlayerModel[],
  now: number,
): Promise<boolean> {
  const host = players.find((p) => p.id === game.hostPlayerId);
  if (host && !isAway(host.lastSeenAt, now, game.status)) return false;
  const next = players
    .filter((p) => p.id !== host?.id && !isAway(p.lastSeenAt, now, game.status))
    .sort((a, b) => a.seat - b.seat)[0];
  if (!next) return false;
  await updateGame(tx, game.id, { hostPlayerId: next.id });
  game.hostPlayerId = next.id;
  return true;
}

export function hostIsStale(
  game: { hostPlayerId: string | null; status: WerewolfGameModel['status'] },
  players: { id: string; lastSeenAt: Date }[],
  now: number,
) {
  const host = players.find((p) => p.id === game.hostPlayerId);
  return !host || isAway(host.lastSeenAt, now, game.status);
}

/** Consistent read of game + players for building a view. */
export async function readSnapshot(gameId: string, now: number): Promise<ViewSource | null> {
  return db.transaction(
    async (tx) => {
      const game = await loadGame(tx, gameId);
      if (!game) return null;
      const players = await loadPlayers(tx, gameId);
      return toViewSource(game, players, now);
    },
    { isolationLevel: 'repeatable read', accessMode: 'read only' },
  );
}

export function toViewSource(
  game: WerewolfGameModel,
  players: WerewolfPlayerModel[],
  now: number,
): ViewSource {
  return { game, players, now };
}
