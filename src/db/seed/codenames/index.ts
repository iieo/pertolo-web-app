import { db } from '@/db';
import { CodenamesCategory, codenamesWordsTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { classicWords } from './classic';
import { foodWords } from './food';
import { natureWords } from './nature';
import { placesWords } from './places';
import { popcultureWords } from './popculture';
import { sexualWords } from './sexual';
import { CodenamesSeed } from './types';

const wordsByCategory: Record<CodenamesCategory, CodenamesSeed[]> = {
  classic: classicWords,
  places: placesWords,
  food: foodWords,
  popculture: popcultureWords,
  nature: natureWords,
  sexual: sexualWords,
};

const BATCH_SIZE = 500;

type Row = {
  word: string;
  wordEn: string;
  category: CodenamesCategory;
};

// The same word may appear in several categories, only duplicates within one category abort.
function collectRows() {
  const rows: Row[] = [];
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, words] of Object.entries(wordsByCategory) as [
    CodenamesCategory,
    CodenamesSeed[],
  ][]) {
    console.log(`${category}: ${words.length} in Dateien`);
    const seen = new Set<string>();
    for (const [index, entry] of words.entries()) {
      const word = entry.de?.trim();
      const wordEn = entry.en?.trim();
      if (!word || !wordEn) {
        empty.push(`${category} #${index + 1}: "${entry.de}" / "${entry.en}"`);
        continue;
      }
      const key = word.toLowerCase();
      if (seen.has(key)) {
        duplicates.push(`"${word}" (${category})`);
        continue;
      }
      seen.add(key);
      rows.push({ word, wordEn, category });
    }
  }

  if (empty.length > 0) {
    throw new Error(`Leere Wörter in den Dateien:\n${empty.join('\n')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`Doppelte Wörter innerhalb einer Kategorie:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Wörter in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedCodenames() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(codenamesWordsTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: [codenamesWordsTable.word, codenamesWordsTable.category],
          set: {
            wordEn: sql`excluded.word_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: codenamesWordsTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(codenamesWordsTable)
      .where(notInArray(codenamesWordsTable.id, ids))
      .returning({ id: codenamesWordsTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: codenamesWordsTable.category, count: count() })
    .from(codenamesWordsTable)
    .groupBy(codenamesWordsTable.category)
    .orderBy(codenamesWordsTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Codenames-Wörter.`);
}

seedCodenames()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
