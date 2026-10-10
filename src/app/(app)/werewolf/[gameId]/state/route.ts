import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { werewolfPlayersTable } from '@/db/schema';

import {
  handOverHostIfStale,
  hostIsStale,
  loadPlayers,
  lockGame,
  readSnapshot,
} from '../../lib/repo';
import { normalizeCode, readToken } from '../../lib/session';
import { View, buildNotJoinedView, buildView } from '../../lib/view';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' };

function json(body: View | { error: string }, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export async function GET(_req: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const gameId = normalizeCode((await params).gameId);
  if (!gameId) return json({ error: 'INVALID_CODE' }, 400);
  const token = await readToken(gameId);

  try {
    let meId: string | null = null;
    if (token) {
      const [me] = await db
        .update(werewolfPlayersTable)
        .set({ lastSeenAt: new Date() })
        .where(and(eq(werewolfPlayersTable.gameId, gameId), eq(werewolfPlayersTable.token, token)))
        .returning({ id: werewolfPlayersTable.id });
      meId = me?.id ?? null;
    }

    let snapshot = await readSnapshot(gameId, Date.now());
    if (!snapshot) return json({ error: 'GAME_NOT_FOUND' }, 404);

    if (meId && hostIsStale(snapshot.game, snapshot.players, snapshot.now)) {
      const changed = await db.transaction(async (tx) => {
        const game = await lockGame(tx, gameId);
        if (!game) return false;
        return handOverHostIfStale(tx, game, await loadPlayers(tx, gameId), Date.now());
      });
      if (changed) snapshot = (await readSnapshot(gameId, Date.now())) ?? snapshot;
    }

    return json(meId ? buildView(snapshot, meId) : buildNotJoinedView(snapshot));
  } catch (error) {
    console.error('[werewolf]', error);
    return json({ error: 'SERVER_ERROR' }, 500);
  }
}
