import { count, eq } from 'drizzle-orm';

import { db } from '@/db';
import { drinkCategoryTable, drinkTaskTable } from '@/db/schema';
import { Result } from '@/util/types';

import { DrinkCategory, sortCategories } from '../categories';

export async function getGameModes(): Promise<Result<DrinkCategory[]>> {
  try {
    const rows = await db
      .select({
        id: drinkCategoryTable.id,
        name: drinkCategoryTable.name,
        description: drinkCategoryTable.description,
        taskCount: count(drinkTaskTable.id),
      })
      .from(drinkCategoryTable)
      .leftJoin(drinkTaskTable, eq(drinkTaskTable.categoryId, drinkCategoryTable.id))
      .groupBy(drinkCategoryTable.id);

    const categories = rows
      .filter((row) => row.taskCount > 0)
      .map(({ id, name, description }) => ({ id, name, description }));

    return { success: true, data: sortCategories(categories) };
  } catch (error) {
    console.error('Failed to load drink categories', error);
    return { success: false, error: 'Failed to load categories' };
  }
}
