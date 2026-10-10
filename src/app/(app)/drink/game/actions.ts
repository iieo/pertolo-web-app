'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { drinkTaskTable } from '@/db/schema';
import { TaskContent } from '@/types/task';
import { Result } from '@/util/types';

// Fact tasks need answer buttons, which the tap-to-advance screen does not have.
function taskText(content: TaskContent): string | null {
  switch (content.type) {
    case 'default':
      return content.content;
    case 'challenge':
      return content.challenge;
    case 'fact':
      return null;
  }
}

export async function getDrinkTasks(categoryId: string): Promise<Result<string[]>> {
  const parsed = z.uuid().safeParse(categoryId);
  if (!parsed.success) return { success: false, error: 'Invalid category' };

  try {
    const rows = await db
      .select({ content: drinkTaskTable.content })
      .from(drinkTaskTable)
      .where(eq(drinkTaskTable.categoryId, parsed.data));

    const tasks = rows
      .map((row) => taskText(row.content)?.trim())
      .filter((text): text is string => !!text);

    return { success: true, data: tasks };
  } catch (error) {
    console.error('Failed to load drink tasks', error);
    return { success: false, error: 'Failed to load tasks' };
  }
}
