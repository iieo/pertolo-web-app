import { db } from '@/db';
import { NeverHaveIEverCategory, neverHaveIEverTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { crazyStatements } from './crazy';
import { deepStatements } from './deep';
import { embarrassingStatements } from './embarrassing';
import { foodStatements } from './food';
import { loveStatements } from './love';
import { normalStatements } from './normal';
import { partyStatements } from './party';
import { schoolStatements } from './school';
import { sexualStatements } from './sexual';
import { travelStatements } from './travel';
import { NeverHaveIEverSeed } from './types';

const statementsByCategory: Record<NeverHaveIEverCategory, NeverHaveIEverSeed[]> = {
  normal: normalStatements,
  party: partyStatements,
  travel: travelStatements,
  love: loveStatements,
  food: foodStatements,
  embarrassing: embarrassingStatements,
  school: schoolStatements,
  crazy: crazyStatements,
  deep: deepStatements,
  sexual: sexualStatements,
};

const BATCH_SIZE = 500;

type Row = {
  statement: string;
  statementEn: string;
  category: NeverHaveIEverCategory;
};

function collectRows() {
  const rows: Row[] = [];
  const seen = new Map<string, NeverHaveIEverCategory>();
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, statements] of Object.entries(statementsByCategory) as [
    NeverHaveIEverCategory,
    NeverHaveIEverSeed[],
  ][]) {
    console.log(`${category}: ${statements.length} in Dateien`);
    for (const [index, item] of statements.entries()) {
      if (!item.de?.trim() || !item.en?.trim()) {
        empty.push(`${category} #${index + 1}: "${item.de}" / "${item.en}"`);
        continue;
      }
      const existing = seen.get(item.de);
      if (existing) {
        duplicates.push(`"${item.de}" (${existing} und ${category})`);
        continue;
      }
      seen.set(item.de, category);
      rows.push({ statement: item.de, statementEn: item.en, category });
    }
  }

  if (empty.length > 0) {
    throw new Error(`Leere Texte in den Dateien:\n${empty.join('\n')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`Doppelte Aussagen in den Dateien:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Aussagen in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedNeverHaveIEver() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(neverHaveIEverTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: neverHaveIEverTable.statement,
          set: {
            category: sql`excluded.category`,
            statementEn: sql`excluded.statement_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: neverHaveIEverTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(neverHaveIEverTable)
      .where(notInArray(neverHaveIEverTable.id, ids))
      .returning({ id: neverHaveIEverTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: neverHaveIEverTable.category, count: count() })
    .from(neverHaveIEverTable)
    .groupBy(neverHaveIEverTable.category)
    .orderBy(neverHaveIEverTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Aussagen.`);
}

seedNeverHaveIEver()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
