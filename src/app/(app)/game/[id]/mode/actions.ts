'use server';

import { db } from '@/db';
import { gameModesTable } from '@/db/schema';

export async function getGameModes() {
  const modes = await db.select().from(gameModesTable);
  return modes;
}
