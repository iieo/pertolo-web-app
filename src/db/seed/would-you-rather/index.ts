import { db } from '@/db';
import { WouldYouRatherCategory, wouldYouRatherTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { coworkersQuestions } from './coworkers';
import { crazyQuestions } from './crazy';
import { deepQuestions } from './deep';
import { dilemmaQuestions } from './dilemma';
import { funnyQuestions } from './funny';
import { grossQuestions } from './gross';
import { normalQuestions } from './normal';
import { partyQuestions } from './party';
import { sexualQuestions } from './sexual';
import { WouldYouRatherSeed } from './types';

const questionsByCategory: Record<WouldYouRatherCategory, WouldYouRatherSeed[]> = {
  normal: normalQuestions,
  funny: funnyQuestions,
  gross: grossQuestions,
  deep: deepQuestions,
  crazy: crazyQuestions,
  party: partyQuestions,
  coworkers: coworkersQuestions,
  dilemma: dilemmaQuestions,
  sexual: sexualQuestions,
};

const BATCH_SIZE = 500;

type Row = {
  optionA: string;
  optionB: string;
  optionAEn: string;
  optionBEn: string;
  category: WouldYouRatherCategory;
};

function collectRows() {
  const rows: Row[] = [];
  const seen = new Map<string, WouldYouRatherCategory>();
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, questions] of Object.entries(questionsByCategory) as [
    WouldYouRatherCategory,
    WouldYouRatherSeed[],
  ][]) {
    console.log(`${category}: ${questions.length} in Dateien`);
    for (const [index, q] of questions.entries()) {
      if ([q.a, q.b, q.aEn, q.bEn].some((text) => !text?.trim())) {
        empty.push(`${category} #${index + 1}: "${q.a}" / "${q.b}"`);
        continue;
      }
      // JSON keeps the pair unambiguous even if a text contains a separator.
      const key = JSON.stringify([q.a, q.b]);
      const existing = seen.get(key);
      if (existing) {
        duplicates.push(`"${q.a}" / "${q.b}" (${existing} und ${category})`);
        continue;
      }
      seen.set(key, category);
      rows.push({ optionA: q.a, optionB: q.b, optionAEn: q.aEn, optionBEn: q.bEn, category });
    }
  }

  if (empty.length > 0) {
    throw new Error(`Leere Texte in den Dateien:\n${empty.join('\n')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`Doppelte Fragen in den Dateien:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Fragen in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedWouldYouRather() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(wouldYouRatherTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: [wouldYouRatherTable.optionA, wouldYouRatherTable.optionB],
          set: {
            category: sql`excluded.category`,
            optionAEn: sql`excluded.option_a_en`,
            optionBEn: sql`excluded.option_b_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: wouldYouRatherTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(wouldYouRatherTable)
      .where(notInArray(wouldYouRatherTable.id, ids))
      .returning({ id: wouldYouRatherTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: wouldYouRatherTable.category, count: count() })
    .from(wouldYouRatherTable)
    .groupBy(wouldYouRatherTable.category)
    .orderBy(wouldYouRatherTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Would You Rather questions.`);
}

seedWouldYouRather()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
