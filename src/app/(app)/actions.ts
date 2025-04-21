'use server';

import { eq, sql } from 'drizzle-orm';
import { generateGameCode } from '@/util/code';
import { db } from '@/db';
import { GameModel, GameSettings, gamesTable, TaskModel, tasksTable } from '@/db/schema';
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
}): Promise<Result<GameModel>> {
  const game = (
    await db.update(gamesTable).set({ gameSettings }).where(eq(gamesTable.id, gameId)).returning()
  )[0];

  if (game === undefined) {
    return { success: false, error: 'Game not found' };
  }

  return { success: true, data: game };
}

export async function dbGetGameByCode(code: string): Promise<Result<GameModel>> {
  const game = (
    await db.select().from(gamesTable).where(eq(gamesTable.gameCode, code)).limit(1)
  )[0];

  if (game === undefined) {
    return { success: false, error: 'Game not found' };
  }

  return { success: true, data: game };
}

export async function dbGetRandomTasks(
  gameMode: string,
  count: number,
): Promise<Result<TaskModel[]>> {
  const tasks = await db
    .select()
    .from(tasksTable)
    .orderBy(sql`RANDOM()`)
    .limit(count);

  if (tasks.length === 0) {
    return { success: false, error: 'No tasks found' };
  }

  return { success: true, data: tasks };
}
