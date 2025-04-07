'use server';

import { db } from '@/db';
import { gameModesTable, gamesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getGameModes() {
  const modes = await db.select().from(gameModesTable);
  return modes;
}

export async function dbSetGameMode(gameId: string, modeId: string) {
  try {
    const result = await db
      .update(gamesTable)
      .set({ currentModeId: modeId })
      .where(eq(gamesTable.id, gameId))
      .returning();
    return result;
  } catch (error) {
    console.error('Error setting game mode:', error);
    throw new Error('Could not set game mode.');
  }
}
