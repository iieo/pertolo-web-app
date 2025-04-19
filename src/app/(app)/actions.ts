'use server';

import { eq } from 'drizzle-orm';
import { generateGameCode } from '@/util/code';
import { db } from '@/db';
import { Game, GameSettings, gamesTable, playersTable } from '@/db/schema';
import { Result } from '@/util/types';

export async function createGame(): Promise<Result<{ gameCode: string }>> {
  let gameCode: string;
  let gameExists = true;
  let attempts = 0;
  const maxAttempts = 5;

  do {
    gameCode = generateGameCode();
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

  const newGame = await db
    .insert(gamesTable)
    .values({
      gameCode: gameCode,
    })
    .returning({ id: gamesTable.id });

  const gameId = newGame[0]?.id;
  if (!gameId) {
    return { success: false, error: 'Failed to create game' };
  }
  return { success: true, data: { gameCode } };
}

export async function joinGame(gameCode: string): Promise<Result<{ gameCode: string }>> {
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
}

export async function dbUpdateGameSettings({
  gameId,
  gameSettings,
}: {
  gameId: string;
  gameSettings: GameSettings;
}): Promise<Result<Game>> {
  const game = (
    await db.update(gamesTable).set({ gameSettings }).where(eq(gamesTable.id, gameId)).returning()
  )[0];

  if (game === undefined) {
    return { success: false, error: 'Game not found' };
  }

  return { success: true, data: game };
}

export async function dbGetGameByCode(code: string): Promise<Result<Game>> {
  const game = (
    await db.select().from(gamesTable).where(eq(gamesTable.gameCode, code)).limit(1)
  )[0];

  if (game === undefined) {
    return { success: false, error: 'Game not found' };
  }

  return { success: true, data: game };
}
