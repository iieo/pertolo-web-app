'use server';

import { db } from '@/db';
import { usersTable, userProfilesTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Result } from '@/util/types';

export async function getLeaderboard(): Promise<
  Result<Array<{ userId: string; name: string; pointsBalance: number }>>
> {
  try {
    const rows = await db
      .select({
        userId: userProfilesTable.userId,
        name: usersTable.name,
        pointsBalance: userProfilesTable.pointsBalance,
      })
      .from(userProfilesTable)
      .innerJoin(usersTable, eq(userProfilesTable.userId, usersTable.id))
      .orderBy(desc(userProfilesTable.pointsBalance))
      .limit(50);

    return { success: true, data: rows };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Bestenliste konnte nicht geladen werden';
    return { success: false, error: message };
  }
}
