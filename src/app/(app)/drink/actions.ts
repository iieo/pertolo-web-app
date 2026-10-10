'use server';

import { inArray } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { drinkTaskTable } from '@/db/schema';
import { DRINK_TASK_KINDS, DrinkTaskKind, TaskContent } from '@/types/task';
import { Result } from '@/util/types';

import type { DrinkTask } from './types';

const categoryIdsSchema = z.array(z.uuid()).min(1).max(20);

const MAX_ROUNDS = 30;
const MAX_SECONDS = 600;

function trimmed(value: string | undefined) {
  return value?.trim() || null;
}

function positiveInt(value: unknown, max: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1
    ? Math.min(Math.round(value), max)
    : null;
}

function taskKind(kind: unknown): DrinkTaskKind {
  return (DRINK_TASK_KINDS as readonly unknown[]).includes(kind) ? (kind as DrinkTaskKind) : 'task';
}

// Fact tasks need answer buttons, which the tap-to-advance screen does not have.
function toDrinkTask(categoryId: string, content: TaskContent): DrinkTask | null {
  switch (content.type) {
    case 'default': {
      const text = content.content.trim();
      if (!text) return null;
      let kind = taskKind(content.kind);
      const rounds = positiveInt(content.rounds, MAX_ROUNDS);
      const seconds = positiveInt(content.seconds, MAX_SECONDS);
      // Without their parameter these kinds have nothing special to show.
      if ((kind === 'rule' || kind === 'curse') && rounds === null) kind = 'task';
      if (kind === 'timer' && seconds === null) kind = 'task';
      return {
        categoryId,
        content: text,
        contentEn: trimmed(content.contentEn),
        kind,
        rounds,
        seconds,
        endContent: trimmed(content.endContent),
        endContentEn: trimmed(content.endContentEn),
      };
    }
    case 'challenge': {
      const text = content.challenge.trim();
      if (!text) return null;
      return {
        categoryId,
        content: text,
        contentEn: null,
        kind: 'task',
        rounds: null,
        seconds: null,
        endContent: null,
        endContentEn: null,
      };
    }
    case 'fact':
      return null;
  }
}

export async function getDrinkTasks(categoryIds: string[]): Promise<Result<DrinkTask[]>> {
  const parsed = categoryIdsSchema.safeParse(categoryIds);
  if (!parsed.success) return { success: false, error: 'Invalid categories' };

  try {
    const rows = await db
      .select({ categoryId: drinkTaskTable.categoryId, content: drinkTaskTable.content })
      .from(drinkTaskTable)
      .where(inArray(drinkTaskTable.categoryId, [...new Set(parsed.data)]));

    const tasks = rows.flatMap((row) => toDrinkTask(row.categoryId, row.content) ?? []);
    return { success: true, data: tasks };
  } catch (error) {
    console.error('Failed to load drink tasks', error);
    return { success: false, error: 'Failed to load tasks' };
  }
}
