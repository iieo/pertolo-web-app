'use server';

import { db } from '@/db';
import { userProfilesTable, pointTransactionsTable } from '@/db/schema';
import { Result } from '@/util/types';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<Result<{ userId: string }>> {
  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });

    if (!result?.user?.id) {
      return { success: false, error: 'Registrierung fehlgeschlagen' };
    }

    const userId = result.user.id;

    await db.transaction(async (tx) => {
      await tx.insert(userProfilesTable).values({
        userId,
        pointsBalance: 10000,
      });
      await tx.insert(pointTransactionsTable).values({
        userId,
        amount: 10000,
        type: 'signup_bonus',
        description: 'Willkommensbonus',
      });
    });

    return { success: true, data: { userId } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Registrierung fehlgeschlagen';
    return { success: false, error: message };
  }
}
