'use server';

import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { DrinkTaskModel, drinkTaskTable, DrinkTaskCategoryMapping } from '@/db/schema';
import { Result } from '@/util/types';

export async function dbGetRandomTasksByCategory(
  categoryId: string,
  count: number,
): Promise<Result<DrinkTaskModel[]>> {
  const tasks = await db
    .select({
      id: drinkTaskTable.id,
      content: drinkTaskTable.content,
      createdAt: drinkTaskTable.createdAt,
      updatedAt: drinkTaskTable.updatedAt,
    })
    .from(drinkTaskTable)
    .innerJoin(DrinkTaskCategoryMapping, eq(drinkTaskTable.id, DrinkTaskCategoryMapping.taskId))
    .where(eq(DrinkTaskCategoryMapping.gameModeId, categoryId))
    .orderBy(sql`RANDOM()`)
    .limit(count);

  if (tasks.length === 0) {
    return { success: false, error: 'No tasks found for this category' };
  }

  return { success: true, data: tasks };
}
