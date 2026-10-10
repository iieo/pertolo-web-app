'use server';

import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { wouldYouRatherTable } from '@/db/schema';
import { Result } from '@/util/types';

import type { Choice, Votes } from './types';

const voteSchema = z.object({
  id: z.uuid(),
  choice: z.enum(['a', 'b']),
});

export async function voteWouldYouRather(id: string, choice: Choice): Promise<Result<Votes>> {
  const parsed = voteSchema.safeParse({ id, choice });
  if (!parsed.success) return { success: false, error: 'Invalid vote' };

  try {
    const column =
      parsed.data.choice === 'a' ? wouldYouRatherTable.votesA : wouldYouRatherTable.votesB;
    const [row] = await db
      .update(wouldYouRatherTable)
      .set(
        parsed.data.choice === 'a'
          ? { votesA: sql`${column} + 1` }
          : { votesB: sql`${column} + 1` },
      )
      .where(eq(wouldYouRatherTable.id, parsed.data.id))
      .returning({ votesA: wouldYouRatherTable.votesA, votesB: wouldYouRatherTable.votesB });

    if (!row) return { success: false, error: 'Question not found' };
    return { success: true, data: row };
  } catch (error) {
    console.error('Failed to save would you rather vote', error);
    return { success: false, error: 'Failed to save vote' };
  }
}
