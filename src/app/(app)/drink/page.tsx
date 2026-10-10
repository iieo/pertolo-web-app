import { count, sql } from 'drizzle-orm';

import { db } from '@/db';
import { drinkCategoryTable, drinkTaskTable } from '@/db/schema';

import { CATEGORY_KEYS } from './categories';
import { DrinkClient } from './drink-client';
import { DrinkCategory, LoadError } from './types';

export const dynamic = 'force-dynamic';

async function loadCategories(): Promise<DrinkCategory[]> {
  const text = sql`coalesce(${drinkTaskTable.content}->>'content', ${drinkTaskTable.content}->>'challenge', '')`;
  const slots =
    sql<number>`(length(${text}) - length(replace(${text}, '{{player}}', ''))) / length('{{player}}')`.mapWith(
      Number,
    );

  const [categoryRows, slotRows] = await Promise.all([
    db
      .select({ id: drinkCategoryTable.id, name: drinkCategoryTable.name })
      .from(drinkCategoryTable),
    db
      .select({ categoryId: drinkTaskTable.categoryId, slots, count: count() })
      .from(drinkTaskTable)
      .where(sql`${drinkTaskTable.content}->>'type' <> 'fact'`)
      .groupBy(drinkTaskTable.categoryId, slots),
  ]);

  return CATEGORY_KEYS.flatMap((key) => {
    const row = categoryRows.find((r) => r.name === key);
    if (!row) return [];
    const slotCounts = slotRows
      .filter((r) => r.categoryId === row.id)
      .map(({ slots, count }) => ({ slots, count }));
    return slotCounts.length > 0 ? [{ id: row.id, key, slotCounts }] : [];
  });
}

export default async function DrinkGame() {
  let categories: DrinkCategory[] = [];
  let loadError: LoadError | null = null;

  try {
    categories = await loadCategories();
    if (categories.length === 0) loadError = 'empty';
  } catch (error) {
    console.error('Failed to load drink categories', error);
    loadError = 'failed';
  }

  return <DrinkClient categories={categories} loadError={loadError} />;
}
