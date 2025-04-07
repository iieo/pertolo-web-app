'use server';

import { db } from '@/db';
import { gamesTable, playersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';


export async function getGameData(gameCode: string) {
  // Use aliased table variable with db.select()
  const gamesFound = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.gameCode, gameCode))
    .limit(1);

  const game = gamesFound.length > 0 ? gamesFound[0] : null;

  if (!game) {
    return null;
  }

  // Use aliased table variable with db.select()
  const playersInGame = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.gameId, game.id));

  return {
    ...game,
    players: playersInGame,
  };
}
