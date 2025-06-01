'use server';

import { db } from '@/db';
import { drinkCategoryTable } from '@/db/schema';

export async function getGameModes() {
  const modes = await db.select().from(drinkCategoryTable);
  return modes;
}
