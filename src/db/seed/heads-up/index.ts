import { db } from '@/db';
import { HeadsUpCategory, headsUpWordsTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { animalsWords } from './animals';
import { brandsWords } from './brands';
import { celebritiesWords } from './celebrities';
import { everydayWords } from './everyday';
import { foodWords } from './food';
import { jobsWords } from './jobs';
import { moviesWords } from './movies';
import { musicWords } from './music';
import { placesWords } from './places';
import { sexualWords } from './sexual';
import { sportsWords } from './sports';
import { HeadsUpSeed } from './types';

const wordsByCategory: Record<HeadsUpCategory, HeadsUpSeed[]> = {
  everyday: everydayWords,
  animals: animalsWords,
  food: foodWords,
  movies: moviesWords,
  celebrities: celebritiesWords,
  music: musicWords,
  sports: sportsWords,
  places: placesWords,
  jobs: jobsWords,
  brands: brandsWords,
  sexual: sexualWords,
};

const BATCH_SIZE = 500;

type Row = {
  word: string;
  wordEn: string;
  category: HeadsUpCategory;
};

function collectRows() {
  const rows: Row[] = [];
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, words] of Object.entries(wordsByCategory) as [
    HeadsUpCategory,
    HeadsUpSeed[],
  ][]) {
    console.log(`${category}: ${words.length} in Dateien`);
    const seen = new Set<string>();
    for (const [index, w] of words.entries()) {
      if ([w.de, w.en].some((text) => !text?.trim())) {
        empty.push(`${category} #${index + 1}: "${w.de}" / "${w.en}"`);
        continue;
      }
      const key = w.de.trim().toLowerCase();
      if (seen.has(key)) {
        duplicates.push(`"${w.de}" (${category})`);
        continue;
      }
      seen.add(key);
      rows.push({ word: w.de.trim(), wordEn: w.en.trim(), category });
    }
  }

  if (empty.length > 0) {
    throw new Error(`Leere Texte in den Dateien:\n${empty.join('\n')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`Doppelte Wörter in den Dateien:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Wörter in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedHeadsUp() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(headsUpWordsTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: [headsUpWordsTable.word, headsUpWordsTable.category],
          set: {
            wordEn: sql`excluded.word_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: headsUpWordsTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(headsUpWordsTable)
      .where(notInArray(headsUpWordsTable.id, ids))
      .returning({ id: headsUpWordsTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: headsUpWordsTable.category, count: count() })
    .from(headsUpWordsTable)
    .groupBy(headsUpWordsTable.category)
    .orderBy(headsUpWordsTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Heads Up words.`);
}

seedHeadsUp()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
