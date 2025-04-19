'use server';

import { eq } from 'drizzle-orm';
import { generateGameCode } from '@/util/code';
import { db } from '@/db';
import { gamesTable, playersTable } from '@/db/schema';
import { Result } from '@/util/types';

export async function createGame(): Promise<Result<{ gameCode: string }>> {
  let gameCode: string;
  let gameExists = true;
  let attempts = 0;
  const maxAttempts = 5;

  do {
    gameCode = generateGameCode();
    // Use aliased table variable with db.select()
    const existingGames = await db
      .select({ id: gamesTable.id })
      .from(gamesTable)
      .where(eq(gamesTable.gameCode, gameCode))
      .limit(1);
    gameExists = existingGames.length > 0;
    attempts++;
    if (attempts >= maxAttempts && gameExists) {
      throw new Error('Failed to generate a unique game code after multiple attempts.');
    }
  } while (gameExists);

  try {
    // Use aliased table variable with db.insert()
    const newGame = await db
      .insert(gamesTable)
      .values({
        gameCode: gameCode,
      })
      .returning({ id: gamesTable.id });

    const gameId = newGame[0]?.id;
    if (newGame === undefined || newGame.length === 0 || gameId === undefined) {
      throw new Error('Failed to create game.');
    }
    return { success: true, data: { gameCode } };
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error('Could not create game.');
  }
}

export async function joinGame(gameCode: string): Promise<Result<{ gameCode: string }>> {
  try {
    // Use aliased table variable with db.select()
    const gamesFound = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.gameCode, gameCode))
      .limit(1);

    const game = gamesFound.length > 0 ? gamesFound[0] : null;

    if (!game || game.gameCode) {
      return { success: false, error: 'Game not found' };
    }

    return { success: true, data: { gameCode: game.gameCode } };
  } catch (error) {
    console.error('Error joining game:', error);
    throw new Error('Could not join game.');
  }
}
