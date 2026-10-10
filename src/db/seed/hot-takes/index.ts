import { db } from '@/db';
import { HotTakeCategory, hotTakesTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { foodTakes } from './food';
import { lifestyleTakes } from './lifestyle';
import { loveTakes } from './love';
import { normalTakes } from './normal';
import { partyTakes } from './party';
import { popcultureTakes } from './popculture';
import { sexualTakes } from './sexual';
import { HotTakeSeed } from './types';
import { unpopularTakes } from './unpopular';
import { workTakes } from './work';

const takesByCategory: Record<HotTakeCategory, HotTakeSeed[]> = {
  normal: normalTakes,
  food: foodTakes,
  love: loveTakes,
  work: workTakes,
  popculture: popcultureTakes,
  lifestyle: lifestyleTakes,
  party: partyTakes,
  unpopular: unpopularTakes,
  sexual: sexualTakes,
};

const BATCH_SIZE = 500;

type Row = {
  statement: string;
  statementEn: string;
  category: HotTakeCategory;
};

function collectRows() {
  const rows: Row[] = [];
  const seen = new Map<string, HotTakeCategory>();
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, takes] of Object.entries(takesByCategory) as [
    HotTakeCategory,
    HotTakeSeed[],
  ][]) {
    console.log(`${category}: ${takes.length} in Dateien`);
    for (const [index, take] of takes.entries()) {
      if (!take.de?.trim() || !take.en?.trim()) {
        empty.push(`${category} #${index + 1}: "${take.de}" / "${take.en}"`);
        continue;
      }
      const existing = seen.get(take.de);
      if (existing) {
        duplicates.push(`"${take.de}" (${existing} und ${category})`);
        continue;
      }
      seen.set(take.de, category);
      rows.push({ statement: take.de, statementEn: take.en, category });
    }
  }

  if (empty.length > 0) {
    throw new Error(`Leere Texte in den Dateien:\n${empty.join('\n')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`Doppelte Hot Takes in den Dateien:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Hot Takes in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedHotTakes() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(hotTakesTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: hotTakesTable.statement,
          set: {
            category: sql`excluded.category`,
            statementEn: sql`excluded.statement_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: hotTakesTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(hotTakesTable)
      .where(notInArray(hotTakesTable.id, ids))
      .returning({ id: hotTakesTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: hotTakesTable.category, count: count() })
    .from(hotTakesTable)
    .groupBy(hotTakesTable.category)
    .orderBy(hotTakesTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Hot Takes.`);
}

seedHotTakes()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
