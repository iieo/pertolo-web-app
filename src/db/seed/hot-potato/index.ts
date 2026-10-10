import { db } from '@/db';
import { HotPotatoCategory, hotPotatoPromptsTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { animalsPrompts } from './animals';
import { brandsPrompts } from './brands';
import { foodPrompts } from './food';
import { musicPrompts } from './music';
import { normalPrompts } from './normal';
import { partyPrompts } from './party';
import { placesPrompts } from './places';
import { popculturePrompts } from './popculture';
import { sexualPrompts } from './sexual';
import { sportsPrompts } from './sports';
import { HotPotatoSeed } from './types';

const promptsByCategory: Record<HotPotatoCategory, HotPotatoSeed[]> = {
  normal: normalPrompts,
  food: foodPrompts,
  animals: animalsPrompts,
  popculture: popculturePrompts,
  places: placesPrompts,
  music: musicPrompts,
  sports: sportsPrompts,
  brands: brandsPrompts,
  party: partyPrompts,
  sexual: sexualPrompts,
};

const BATCH_SIZE = 500;

type Row = {
  prompt: string;
  promptEn: string;
  category: HotPotatoCategory;
};

function collectRows() {
  const rows: Row[] = [];
  const seen = new Map<string, HotPotatoCategory>();
  const duplicates: string[] = [];
  const empty: string[] = [];

  for (const [category, prompts] of Object.entries(promptsByCategory) as [
    HotPotatoCategory,
    HotPotatoSeed[],
  ][]) {
    console.log(`${category}: ${prompts.length} in Dateien`);
    for (const [index, p] of prompts.entries()) {
      if (!p.de?.trim() || !p.en?.trim()) {
        empty.push(`${category} #${index + 1}: "${p.de}" / "${p.en}"`);
        continue;
      }
      const existing = seen.get(p.de);
      if (existing) {
        duplicates.push(`"${p.de}" (${existing} und ${category})`);
        continue;
      }
      seen.set(p.de, category);
      rows.push({ prompt: p.de, promptEn: p.en, category });
    }
  }

  if (empty.length > 0) {
    throw new Error(`Leere Texte in den Dateien:\n${empty.join('\n')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`Doppelte Aufgaben in den Dateien:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Aufgaben in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedHotPotato() {
  const rows = collectRows();

  const deleted = await db.transaction(async (tx) => {
    const ids: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const upserted = await tx
        .insert(hotPotatoPromptsTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: hotPotatoPromptsTable.prompt,
          set: {
            category: sql`excluded.category`,
            promptEn: sql`excluded.prompt_en`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: hotPotatoPromptsTable.id });
      ids.push(...upserted.map((row) => row.id));
    }

    return tx
      .delete(hotPotatoPromptsTable)
      .where(notInArray(hotPotatoPromptsTable.id, ids))
      .returning({ id: hotPotatoPromptsTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: hotPotatoPromptsTable.category, count: count() })
    .from(hotPotatoPromptsTable)
    .groupBy(hotPotatoPromptsTable.category)
    .orderBy(hotPotatoPromptsTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} Hot Potato prompts.`);
}

seedHotPotato()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
