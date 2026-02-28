'use server';

import { db } from '@/db';
import { murderiOrdersTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { Result } from '@/util/types';

function generateGameId(length = 4): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export async function dbCreateGame(players: string[]): Promise<Result<{ gameId: string }>> {
  if (players.length < 3) {
    return { success: false, error: 'Need at least 3 players' };
  }

  const uniqueNames = new Set(players.map((p) => p.trim()));
  if (uniqueNames.size !== players.length) {
    return { success: false, error: 'Player names must be unique' };
  }

  const maxRetries = 5;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const gameId = generateGameId();

    const existing = await db
      .select({ id: murderiOrdersTable.id })
      .from(murderiOrdersTable)
      .where(eq(murderiOrdersTable.gameId, gameId))
      .limit(1);

    if (existing.length > 0) continue;

    const shuffled = fisherYatesShuffle(players);
    const orders = shuffled.map((killer, i) => ({
      gameId,
      killer,
      victim: shuffled[(i + 1) % shuffled.length]!,
    }));

    try {
      await db.transaction(async (tx) => {
        await tx.insert(murderiOrdersTable).values(orders);
      });
      return { success: true, data: { gameId } };
    } catch {
      continue;
    }
  }

  return { success: false, error: 'Failed to create game. Please try again.' };
}

export async function dbGetPlayers(gameId: string) {
  return await db.select().from(murderiOrdersTable).where(eq(murderiOrdersTable.gameId, gameId));
}

export async function dbGetVictim(gameId: string, killer: string) {
  return await db
    .select()
    .from(murderiOrdersTable)
    .where(and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.killer, killer)));
}

export async function dbUpdateVictim(gameId: string, player: string): Promise<Result<void>> {
  try {
    await db.transaction(
      async (tx) => {
        const orders = await tx
          .select()
          .from(murderiOrdersTable)
          .where(
            and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.killer, player)),
          );

        const order = orders[0];
        if (!order) throw new Error('Order not found');
        if (order.victim == null) throw new Error('Player is already eliminated');

        await tx
          .update(murderiOrdersTable)
          .set({ victim: order.victim })
          .where(
            and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.victim, player)),
          );

        await tx
          .update(murderiOrdersTable)
          .set({ victim: null })
          .where(
            and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.killer, player)),
          );
      },
      { isolationLevel: 'serializable' },
    );

    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    return { success: false, error: message };
  }
}

export async function dbGetOrderState(
  gameId: string,
  player: string,
): Promise<Result<{ victim: string | null; isWinner: boolean }>> {
  const orders = await db
    .select()
    .from(murderiOrdersTable)
    .where(and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.killer, player)));

  const order = orders[0];
  if (!order) {
    return { success: false, error: 'Player not found in this game' };
  }

  return {
    success: true,
    data: {
      victim: order.victim,
      isWinner: order.killer === order.victim,
    },
  };
}

export async function dbGetGameOverview(
  gameId: string,
): Promise<Result<{ players: { name: string; isAlive: boolean }[] }>> {
  const orders = await db
    .select()
    .from(murderiOrdersTable)
    .where(eq(murderiOrdersTable.gameId, gameId));

  if (orders.length === 0) {
    return { success: false, error: 'Game not found' };
  }

  const players = orders.map((o) => ({
    name: o.killer,
    isAlive: o.victim !== null,
  }));

  return { success: true, data: { players } };
}
