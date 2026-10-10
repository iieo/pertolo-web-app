'use server';

import { randomInt, randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '@/db';
import { murderiOrdersTable } from '@/db/schema';
import { Result } from '@/util/types';

import {
  buildMyState,
  buildOverview,
  claimCookieName,
  claimCookieOptions,
  getClaimToken,
  getGameRows,
  getPlayerByToken,
} from './data';
import {
  CODE_LENGTH,
  ErrorKey,
  gamePath,
  isReservedName,
  isValidCode,
  MAX_NAME_LENGTH,
  MAX_PLAYERS,
  MIN_PLAYERS,
  nameKey,
  normalizeCode,
  normalizeName,
} from './limits';
import type { MyState, Overview } from './types';

const REPORT_ATTEMPTS = 4;

function fail<T>(error: ErrorKey): Result<T> {
  return { success: false, error };
}

function parseGameId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const code = normalizeCode(input);
  return isValidCode(code) ? code : null;
}

function generateGameId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < CODE_LENGTH; i++) result += chars[randomInt(chars.length)];
  return result;
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

// Drizzle wraps driver errors, so the Postgres code can sit on a nested cause.
function isSerializationFailure(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 4 && typeof current === 'object' && current !== null; depth++) {
    if ((current as { code?: unknown }).code === '40001') return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function dbCreateGame(input: unknown): Promise<Result<{ gameId: string }>> {
  if (!Array.isArray(input) || !input.every((p) => typeof p === 'string')) {
    return fail('invalidInput');
  }
  const players = (input as string[]).map(normalizeName);
  if (players.some((p) => p.length === 0)) return fail('emptyName');
  if (players.some((p) => p.length > MAX_NAME_LENGTH)) return fail('nameTooLong');
  if (players.some(isReservedName)) return fail('reservedName');
  if (players.length < MIN_PLAYERS) return fail('tooFewPlayers');
  if (players.length > MAX_PLAYERS) return fail('tooManyPlayers');
  if (new Set(players.map(nameKey)).size !== players.length) return fail('duplicateName');

  try {
    for (let attempt = 0; attempt < 8; attempt++) {
      const gameId = generateGameId();
      const existing = await db
        .select({ id: murderiOrdersTable.id })
        .from(murderiOrdersTable)
        .where(eq(murderiOrdersTable.gameId, gameId))
        .limit(1);
      if (existing.length > 0) continue;

      const shuffled = shuffle(players);
      await db.insert(murderiOrdersTable).values(
        shuffled.map((killer, i) => ({
          gameId,
          killer,
          victim: shuffled[(i + 1) % shuffled.length]!,
        })),
      );
      return { success: true, data: { gameId } };
    }
    return fail('busy');
  } catch (error) {
    console.error('murderi: create game failed', error);
    return fail('unknown');
  }
}

export async function dbFindGame(code: unknown): Promise<Result<{ gameId: string }>> {
  const gameId = parseGameId(code);
  if (!gameId) return fail('invalidInput');
  try {
    const rows = await db
      .select({ id: murderiOrdersTable.id })
      .from(murderiOrdersTable)
      .where(eq(murderiOrdersTable.gameId, gameId))
      .limit(1);
    return rows.length > 0 ? { success: true, data: { gameId } } : fail('notFound');
  } catch (error) {
    console.error('murderi: find game failed', error);
    return fail('unknown');
  }
}

export async function claimPlayer(
  gameIdInput: unknown,
  playerInput: unknown,
): Promise<Result<{ name: string }>> {
  const gameId = parseGameId(gameIdInput);
  if (
    !gameId ||
    typeof playerInput !== 'string' ||
    playerInput.length === 0 ||
    playerInput.length > MAX_NAME_LENGTH
  ) {
    return fail('invalidInput');
  }
  const player = playerInput;

  try {
    const store = await cookies();
    const existingToken = store.get(claimCookieName(gameId))?.value;
    if (existingToken) {
      const current = await getPlayerByToken(gameId, existingToken);
      if (current) {
        return current.killer === player
          ? { success: true, data: { name: current.killer } }
          : fail('alreadyClaimed');
      }
    }

    const token = randomUUID();
    const claimed = await db
      .update(murderiOrdersTable)
      .set({ claimToken: token })
      .where(
        and(
          eq(murderiOrdersTable.gameId, gameId),
          eq(murderiOrdersTable.killer, player),
          isNull(murderiOrdersTable.claimToken),
        ),
      )
      .returning({ killer: murderiOrdersTable.killer });

    if (claimed.length === 0) {
      const exists = await db
        .select({ id: murderiOrdersTable.id })
        .from(murderiOrdersTable)
        .where(and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.killer, player)))
        .limit(1);
      return fail(exists.length > 0 ? 'alreadyTaken' : 'notFound');
    }

    store.set(claimCookieName(gameId), token, claimCookieOptions);
    return { success: true, data: { name: claimed[0]!.killer } };
  } catch (error) {
    console.error('murderi: claim failed', error);
    return fail('unknown');
  }
}

// Only ever returns the caller's own token, read from their claim cookie.
export async function dbGetTransferLink(gameIdInput: unknown): Promise<Result<{ path: string }>> {
  const gameId = parseGameId(gameIdInput);
  if (!gameId) return fail('invalidInput');
  try {
    const token = await getClaimToken(gameId);
    if (!token) return fail('notClaimed');
    const me = await getPlayerByToken(gameId, token);
    if (!me) return fail('notClaimed');
    const query = new URLSearchParams({ t: token });
    return { success: true, data: { path: `${gamePath(gameId)}/resume?${query}` } };
  } catch (error) {
    console.error('murderi: transfer link failed', error);
    return fail('unknown');
  }
}

export async function dbGetGameOverview(gameIdInput: unknown): Promise<Result<Overview>> {
  const gameId = parseGameId(gameIdInput);
  if (!gameId) return fail('invalidInput');
  try {
    const rows = await getGameRows(gameId);
    if (rows.length === 0) return fail('notFound');
    return { success: true, data: buildOverview(gameId, rows, await getClaimToken(gameId)) };
  } catch (error) {
    console.error('murderi: overview failed', error);
    return fail('unknown');
  }
}

export async function dbGetMyState(gameIdInput: unknown): Promise<Result<MyState>> {
  const gameId = parseGameId(gameIdInput);
  if (!gameId) return fail('invalidInput');
  try {
    const token = await getClaimToken(gameId);
    if (!token) return fail('notClaimed');
    const rows = await getGameRows(gameId);
    if (rows.length === 0) return fail('notFound');
    const me = rows.find((r) => r.claimToken === token);
    if (!me) return fail('notClaimed');
    return { success: true, data: buildMyState(rows, me) };
  } catch (error) {
    console.error('murderi: state failed', error);
    return fail('unknown');
  }
}

// The reporting player always comes from the claim cookie, never from the client.
export async function dbUpdateVictim(gameIdInput: unknown): Promise<Result<void>> {
  const gameId = parseGameId(gameIdInput);
  if (!gameId) return fail('invalidInput');

  let token: string | null;
  try {
    token = await getClaimToken(gameId);
  } catch {
    return fail('unknown');
  }
  if (!token) return fail('notClaimed');

  for (let attempt = 0; attempt < REPORT_ATTEMPTS; attempt++) {
    try {
      const outcome = await db.transaction(
        async (tx): Promise<ErrorKey | null> => {
          const rows = await tx
            .select({
              id: murderiOrdersTable.id,
              killer: murderiOrdersTable.killer,
              victim: murderiOrdersTable.victim,
              claimToken: murderiOrdersTable.claimToken,
            })
            .from(murderiOrdersTable)
            .where(eq(murderiOrdersTable.gameId, gameId));

          if (rows.length === 0) return 'notFound';
          const me = rows.find((r) => r.claimToken === token);
          if (!me) return 'notClaimed';
          if (me.victim === null) return 'alreadyDead';
          if (me.victim === me.killer) return 'alreadyWon';
          if (rows.some((r) => r.victim !== null && r.killer === r.victim)) return 'gameOver';

          const hunter = rows.find((r) => r.victim === me.killer);
          if (!hunter) return 'unknown';

          await tx
            .update(murderiOrdersTable)
            .set({ victim: me.victim })
            .where(eq(murderiOrdersTable.id, hunter.id));
          await tx
            .update(murderiOrdersTable)
            .set({ victim: null })
            .where(eq(murderiOrdersTable.id, me.id));
          return null;
        },
        { isolationLevel: 'serializable' },
      );

      return outcome ? fail(outcome) : { success: true, data: undefined };
    } catch (error) {
      if (isSerializationFailure(error)) {
        if (attempt < REPORT_ATTEMPTS - 1) await wait(50 * (attempt + 1) + randomInt(50));
        continue;
      }
      console.error('murderi: report failed', error);
      return fail('unknown');
    }
  }
  return fail('busy');
}
