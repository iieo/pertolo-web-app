import { db } from '@/db';
import { drinkCategoryTable, drinkTaskTable } from '@/db/schema';
import { count, eq, inArray } from 'drizzle-orm';
import { exit } from 'process';

import { chaosTasks } from './chaos';
import { curatedNormalTasks, curatedWildTasks } from './curated';
import { duellTasks } from './duell';
import { normalTasks } from './normal';
import { partyTasks } from './party';
import { spicyTasks } from './spicy';
import { wahrheitTasks } from './wahrheit';
import { wildTasks } from './wild';

type CategorySeed = {
  name: string;
  description: string;
  tasks: string[];
};

// Display order in the game is defined separately in src/app/(app)/drink/categories.ts.
const categories: CategorySeed[] = [
  {
    name: 'Normal',
    description: 'Der Klassiker für jede Runde',
    tasks: [...curatedNormalTasks, ...normalTasks],
  },
  { name: 'Party', description: 'Laut, schnell und mit der ganzen Runde', tasks: partyTasks },
  { name: 'Duell', description: 'Spieler treten gegeneinander an', tasks: duellTasks },
  { name: 'Wahrheit', description: 'Geständnisse und unangenehme Fragen', tasks: wahrheitTasks },
  {
    name: 'Chaos',
    description: 'Regeln, Rollen und Flüche, die hängen bleiben',
    tasks: chaosTasks,
  },
  {
    name: 'Wild',
    description: 'Frecher, mutiger, mehr Schlucke',
    tasks: [...curatedWildTasks, ...wildTasks],
  },
  { name: 'Spicy', description: 'Flirty und frech, nur für Erwachsene', tasks: spicyTasks },
];

const BATCH_SIZE = 500;
const PLACEHOLDER = /\{\{[^}]*\}\}/g;

function collectTasks() {
  const seen = new Map<string, string>();
  const invalid: string[] = [];
  const result: { category: CategorySeed; tasks: string[] }[] = [];

  for (const category of categories) {
    const tasks: string[] = [];
    let duplicates = 0;

    for (const raw of category.tasks) {
      const task = raw.trim().replace(/\s+/g, ' ');
      if (!task) continue;
      if ((task.match(PLACEHOLDER) ?? []).some((p) => p !== '{{player}}')) {
        invalid.push(`${category.name}: "${task}"`);
        continue;
      }
      if (seen.has(task)) {
        duplicates++;
        continue;
      }
      seen.set(task, category.name);
      tasks.push(task);
    }

    console.log(
      `${category.name}: ${category.tasks.length} in Dateien, ${tasks.length} eindeutig` +
        (duplicates > 0 ? `, ${duplicates} Duplikate übersprungen` : ''),
    );
    if (tasks.length === 0) {
      throw new Error(`Keine Aufgaben für ${category.name} gefunden, Sync abgebrochen.`);
    }
    result.push({ category, tasks });
  }

  if (invalid.length > 0) {
    throw new Error(`Ungültige Platzhalter, erlaubt ist nur {{player}}:\n${invalid.join('\n')}`);
  }

  return result;
}

async function seedDrinkTasks() {
  const collected = collectTasks();

  await db.transaction(async (tx) => {
    for (const { category, tasks } of collected) {
      const [row] = await tx
        .insert(drinkCategoryTable)
        .values({ name: category.name, description: category.description })
        .onConflictDoUpdate({
          target: drinkCategoryTable.name,
          set: { description: category.description, updatedAt: new Date() },
        })
        .returning({ id: drinkCategoryTable.id });
      if (!row) throw new Error(`Kategorie ${category.name} konnte nicht angelegt werden.`);

      await tx.delete(drinkTaskTable).where(eq(drinkTaskTable.categoryId, row.id));

      const values = tasks.map((content) => ({
        categoryId: row.id,
        content: { type: 'default' as const, content },
      }));
      for (let i = 0; i < values.length; i += BATCH_SIZE) {
        await tx.insert(drinkTaskTable).values(values.slice(i, i + BATCH_SIZE));
      }
    }
  });

  const counts = await db
    .select({ name: drinkCategoryTable.name, count: count(drinkTaskTable.id) })
    .from(drinkCategoryTable)
    .leftJoin(drinkTaskTable, eq(drinkTaskTable.categoryId, drinkCategoryTable.id))
    .where(
      inArray(
        drinkCategoryTable.name,
        categories.map((c) => c.name),
      ),
    )
    .groupBy(drinkCategoryTable.name);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.name}: ${row.count}`);
  }
}

seedDrinkTasks()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
