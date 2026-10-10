import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { murderiOrdersTable } from '@/db/schema';

import type { MyState, Overview } from './types';

// Server-only helpers. Kept out of actions.ts so they are not exposed as server actions.

export const CLAIM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const CLAIM_COOKIE_PATH = '/murderi';

export const claimCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: CLAIM_COOKIE_MAX_AGE,
  path: CLAIM_COOKIE_PATH,
} as const;

export function claimCookieName(gameId: string): string {
  return `murderi_${gameId}`;
}

export async function getClaimToken(gameId: string): Promise<string | null> {
  const store = await cookies();
  return store.get(claimCookieName(gameId))?.value ?? null;
}

export type GameRow = {
  id: string;
  killer: string;
  victim: string | null;
  claimToken: string | null;
};

export async function getGameRows(gameId: string): Promise<GameRow[]> {
  return db
    .select({
      id: murderiOrdersTable.id,
      killer: murderiOrdersTable.killer,
      victim: murderiOrdersTable.victim,
      claimToken: murderiOrdersTable.claimToken,
    })
    .from(murderiOrdersTable)
    .where(eq(murderiOrdersTable.gameId, gameId));
}

export async function getPlayerByToken(gameId: string, token: string): Promise<GameRow | null> {
  const rows = await db
    .select({
      id: murderiOrdersTable.id,
      killer: murderiOrdersTable.killer,
      victim: murderiOrdersTable.victim,
      claimToken: murderiOrdersTable.claimToken,
    })
    .from(murderiOrdersTable)
    .where(and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.claimToken, token)))
    .limit(1);
  return rows[0] ?? null;
}

export function findWinner(rows: GameRow[]): string | null {
  return rows.find((r) => r.victim !== null && r.killer === r.victim)?.killer ?? null;
}

export function buildOverview(gameId: string, rows: GameRow[], token: string | null): Overview {
  const me = token ? rows.find((r) => r.claimToken === token) : undefined;
  // Sorted by name, because the insertion order is the kill chain and would reveal every target.
  const players = rows
    .map((r) => ({ name: r.killer, alive: r.victim !== null, claimed: r.claimToken !== null }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    gameId,
    players,
    you: me ? { name: me.killer, alive: me.victim !== null } : null,
    winner: findWinner(rows),
  };
}

export function buildMyState(rows: GameRow[], me: GameRow): MyState {
  return {
    name: me.killer,
    target: me.victim,
    isWinner: me.victim === me.killer,
    winner: findWinner(rows),
  };
}
