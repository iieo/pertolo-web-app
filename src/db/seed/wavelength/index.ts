import { db } from '@/db';
import { WavelengthCategory, wavelengthSpectrumsTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { abstractSpectrums } from './abstract';
import { foodSpectrums } from './food';
import { normalSpectrums } from './normal';
import { partySpectrums } from './party';
import { peopleSpectrums } from './people';
import { popcultureSpectrums } from './popculture';
import { sexualSpectrums } from './sexual';
import { WavelengthSeed } from './types';

const spectrumsByCategory: Record<WavelengthCategory, WavelengthSeed[]> = {
  normal: normalSpectrums,
  food: foodSpectrums,
  popculture: popcultureSpectrums,
  people: peopleSpectrums,
  abstract: abstractSpectrums,
  party: partySpectrums,
  sexual: sexualSpectrums,
};

const BATCH_SIZE = 500;

type Row = WavelengthSeed & { category: WavelengthCategory };

function collectRows() {
  const rows: Row[] = [];
  const seen = new Map<string, WavelengthCategory>();
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, spectrums] of Object.entries(spectrumsByCategory) as [
    WavelengthCategory,
    WavelengthSeed[],
  ][]) {
    console.log(`${category}: ${spectrums.length} in Dateien`);
    for (const [index, spectrum] of spectrums.entries()) {
      const { left, right, leftEn, rightEn } = spectrum;
      if (!left?.trim() || !right?.trim() || !leftEn?.trim() || !rightEn?.trim()) {
        empty.push(`${category} #${index + 1}: "${left}" / "${right}"`);
        continue;
      }
      // A reversed pair is the same spectrum, so it counts as a duplicate too.
      const key = [left, right].sort().join('\u0000');
      const existing = seen.get(key);
      if (existing) {
        duplicates.push(`"${left}" / "${right}" (${existing} und ${category})`);
        continue;
      }
      seen.set(key, category);
      rows.push({ left, right, leftEn, rightEn, category });
    }
  }

  if (empty.length > 0) {
    throw new Error(`Leere Texte in den Dateien:\n${empty.join('\n')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`Doppelte Skalen in den Dateien:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Skalen in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedWavelength() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(wavelengthSpectrumsTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: [wavelengthSpectrumsTable.left, wavelengthSpectrumsTable.right],
          set: {
            category: sql`excluded.category`,
            leftEn: sql`excluded.left_en`,
            rightEn: sql`excluded.right_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: wavelengthSpectrumsTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(wavelengthSpectrumsTable)
      .where(notInArray(wavelengthSpectrumsTable.id, ids))
      .returning({ id: wavelengthSpectrumsTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: wavelengthSpectrumsTable.category, count: count() })
    .from(wavelengthSpectrumsTable)
    .groupBy(wavelengthSpectrumsTable.category)
    .orderBy(wavelengthSpectrumsTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Skalen.`);
}

seedWavelength()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
