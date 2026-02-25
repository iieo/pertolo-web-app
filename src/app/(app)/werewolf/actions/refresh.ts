'use server';

import { db } from '@/db';
import { werewolfGamesTable, werewolfPlayersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function refreshGameState(gameId: string) {
  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game) {
    throw new Error('Game not found');
  }

  const players = await db.query.werewolfPlayersTable.findMany({
    where: eq(werewolfPlayersTable.gameId, gameId),
  });

  return { game, players };
}
