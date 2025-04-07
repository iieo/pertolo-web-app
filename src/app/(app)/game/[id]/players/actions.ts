'use server';

import { db } from '@/db';
import { playersTable } from '@/db/schema';
import { Result } from '@/util/types';

export async function dbAddPlayer(
  gameId: string,
  playerName: string,
): Promise<Result<{ playerId: string }>> {
  try {
    // Use aliased table variable with db.insert()
    const newPlayer = await db
      .insert(playersTable)
      .values({
        gameId: gameId,
        name: playerName,
        isHost: false,
      })
      .returning({ id: playersTable.id });

    const playerId = newPlayer[0]?.id;
    if (newPlayer === undefined || newPlayer.length === 0 || playerId === undefined) {
      throw new Error('Failed to create player.');
    }

    return { success: true, data: { playerId } };
  } catch (error) {
    console.error('Error creating player:', error);
    throw new Error('Could not create player.');
  }
}
