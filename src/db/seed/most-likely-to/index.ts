import { db } from '@/db';
import { MostLikelyToCategory, mostLikelyToTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { crazyQuestions } from './crazy';
import { friendsQuestions } from './friends';
import { futureQuestions } from './future';
import { loveQuestions } from './love';
import { normalQuestions } from './normal';
import { partyQuestions } from './party';
import { roastQuestions } from './roast';
import { sexualQuestions } from './sexual';
import { MostLikelyToSeed } from './types';
import { workQuestions } from './work';

const questionsByCategory: Record<MostLikelyToCategory, MostLikelyToSeed[]> = {
  normal: normalQuestions,
  party: partyQuestions,
  friends: friendsQuestions,
  work: workQuestions,
  love: loveQuestions,
  crazy: crazyQuestions,
  future: futureQuestions,
  roast: roastQuestions,
  sexual: sexualQuestions,
};

const BATCH_SIZE = 500;

type Row = {
  question: string;
  questionEn: string;
  category: MostLikelyToCategory;
};

function collectRows() {
  const rows: Row[] = [];
  const seen = new Map<string, MostLikelyToCategory>();
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, questions] of Object.entries(questionsByCategory) as [
    MostLikelyToCategory,
    MostLikelyToSeed[],
  ][]) {
    console.log(`${category}: ${questions.length} in Dateien`);
    for (const [index, question] of questions.entries()) {
      if (!question.de?.trim() || !question.en?.trim()) {
        empty.push(`${category} #${index + 1}: "${question.de}" / "${question.en}"`);
        continue;
      }
      const existing = seen.get(question.de);
      if (existing) {
        duplicates.push(`"${question.de}" (${existing} und ${category})`);
        continue;
      }
      seen.set(question.de, category);
      rows.push({ question: question.de, questionEn: question.en, category });
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

async function seedMostLikelyTo() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(mostLikelyToTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: mostLikelyToTable.question,
          set: {
            category: sql`excluded.category`,
            questionEn: sql`excluded.question_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: mostLikelyToTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(mostLikelyToTable)
      .where(notInArray(mostLikelyToTable.id, ids))
      .returning({ id: mostLikelyToTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: mostLikelyToTable.category, count: count() })
    .from(mostLikelyToTable)
    .groupBy(mostLikelyToTable.category)
    .orderBy(mostLikelyToTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Most Likely To Fragen.`);
}

seedMostLikelyTo()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
