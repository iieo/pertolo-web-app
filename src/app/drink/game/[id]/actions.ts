'use server';

import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { GameModel, GameSettings, gamesTable, TaskModel, tasksTable } from '@/db/schema';
import { Result } from '@/util/types';

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
