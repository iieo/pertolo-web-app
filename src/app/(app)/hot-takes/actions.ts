'use server';

import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { hotTakesTable } from '@/db/schema';
import { Result } from '@/util/types';

import type { Choice, Votes } from './types';

const voteSchema = z.object({
  id: z.uuid(),
  choice: z.enum(['agree', 'disagree']),
});

export async function voteHotTake(id: string, choice: Choice): Promise<Result<Votes>> {
  const parsed = voteSchema.safeParse({ id, choice });
  if (!parsed.success) return { success: false, error: 'Invalid vote' };

  try {
    const [row] = await db
      .update(hotTakesTable)
      .set(
        parsed.data.choice === 'agree'
          ? { votesAgree: sql`${hotTakesTable.votesAgree} + 1` }
          : { votesDisagree: sql`${hotTakesTable.votesDisagree} + 1` },
      )
      .where(eq(hotTakesTable.id, parsed.data.id))
      .returning({
        votesAgree: hotTakesTable.votesAgree,
        votesDisagree: hotTakesTable.votesDisagree,
      });

    if (!row) return { success: false, error: 'Hot take not found' };
    return { success: true, data: row };
  } catch (error) {
    console.error('Failed to save hot take vote', error);
    return { success: false, error: 'Failed to save vote' };
  }
}
