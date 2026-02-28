'use server';

import { db } from '@/db';
import { murderiOrdersTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function dbInsertOrder(gameId: string, killer: string, victim: string) {
  await db.insert(murderiOrdersTable).values({ gameId, killer, victim });
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

export async function dbUpdateVictim(gameId: string, player: string) {
  const orders = await dbGetVictim(gameId, player);
  const order = orders[0];
  if (!order) throw new Error('Order not found');
  if (order.victim == null) throw new Error('Player is already eliminated');

  // Transfer the killed player's victim to whoever was hunting them
  await db
    .update(murderiOrdersTable)
    .set({ victim: order.victim })
    .where(and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.victim, player)));

  // Mark the killed player as eliminated
  await db
    .update(murderiOrdersTable)
    .set({ victim: null })
    .where(and(eq(murderiOrdersTable.gameId, gameId), eq(murderiOrdersTable.killer, player)));
}
