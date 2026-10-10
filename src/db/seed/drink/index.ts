import { db } from '@/db';
import { drinkCategoryTable, drinkTaskTable } from '@/db/schema';
import type { DefaultTask } from '@/types/task';
import { count, eq, inArray } from 'drizzle-orm';
import { exit } from 'process';

import { chaosTasks } from './chaos';
import { classifyTask } from './classify';
import { curatedNormalTasks, curatedWildTasks } from './curated';
import { duellTasks } from './duell';
import { chaosTasksEn } from './en/chaos';
import { curatedNormalTasksEn, curatedWildTasksEn } from './en/curated';
import { duellTasksEn } from './en/duell';
import { normalTasksEn } from './en/normal';
import { partyTasksEn } from './en/party';
import { sexualTasksEn } from './en/sexual';
import { wahrheitTasksEn } from './en/wahrheit';
import { wildTasksEn } from './en/wild';
import { normalTasks } from './normal';
import { partyTasks } from './party';
import { sexualTasks } from './sexual';
import { specialTasks } from './specials';
import { wahrheitTasks } from './wahrheit';
import { wildTasks } from './wild';

type CategorySeed = {
  name: string;
  description: string;
  tasks: DefaultTask[];
};

const BATCH_SIZE = 500;
const PLACEHOLDER = /\{\{[^}]*\}\}/g;
const ALLOWED_PLACEHOLDERS = new Set(['{{player}}', '{{sips}}']);

function pairs(file: string, de: string[], en: string[]): DefaultTask[] {
  if (de.length !== en.length) {
    throw new Error(
      `${file}: ${de.length} deutsche, aber ${en.length} englische Aufgaben. Die Listen müssen gleich lang sein.`,
    );
  }
  return de.map((task, i) => classifyTask(normalize(task), normalize(en[i]!)));
}

function specials(category: string): DefaultTask[] {
  return specialTasks.filter((s) => s.category === category).map((s) => s.task);
}

// Names and descriptions shown in the game live in src/app/(app)/drink/i18n.ts, keyed by these names.
function buildCategories(): CategorySeed[] {
  return [
    {
      name: 'Normal',
      description: 'Der Klassiker für jede Runde',
      tasks: [
        ...pairs('curated.ts (Normal)', curatedNormalTasks, curatedNormalTasksEn),
        ...pairs('normal.ts', normalTasks, normalTasksEn),
        ...specials('Normal'),
      ],
    },
    {
      name: 'Party',
      description: 'Laut, schnell und mit der ganzen Runde',
      tasks: [...pairs('party.ts', partyTasks, partyTasksEn), ...specials('Party')],
    },
    {
      name: 'Duell',
      description: 'Spieler treten gegeneinander an',
      tasks: [...pairs('duell.ts', duellTasks, duellTasksEn), ...specials('Duell')],
    },
    {
      name: 'Wahrheit',
      description: 'Geständnisse und unangenehme Fragen',
      tasks: [...pairs('wahrheit.ts', wahrheitTasks, wahrheitTasksEn), ...specials('Wahrheit')],
    },
    {
      name: 'Chaos',
      description: 'Regeln, Rollen und Flüche, die hängen bleiben',
      tasks: [...pairs('chaos.ts', chaosTasks, chaosTasksEn), ...specials('Chaos')],
    },
    {
      name: 'Wild',
      description: 'Frecher, mutiger, mehr Schlucke',
      tasks: [
        ...pairs('curated.ts (Wild)', curatedWildTasks, curatedWildTasksEn),
        ...pairs('wild.ts', wildTasks, wildTasksEn),
        ...specials('Wild'),
      ],
    },
    {
      name: 'Sexual',
      description: 'Dating, Flirt und Sex',
      tasks: [...pairs('sexual.ts', sexualTasks, sexualTasksEn), ...specials('Sexual')],
    },
  ];
}

function normalize(text: string) {
  return text.trim().replace(/\s+/g, ' ');
}

function hasInvalidPlaceholder(text: string) {
  return (text.match(PLACEHOLDER) ?? []).some((p) => !ALLOWED_PLACEHOLDERS.has(p));
}

function slots(text: string, placeholder: string) {
  return text.split(placeholder).length - 1;
}

// Kind-specific fields the game relies on. Returns a reason when the task can't be played as its kind.
function kindProblem(task: DefaultTask) {
  const players = slots(task.content, '{{player}}');
  switch (task.kind) {
    case 'versus':
      return players < 2 ? 'versus braucht mindestens zwei {{player}}' : null;
    case 'roulette':
      return players !== 1 ? 'roulette braucht genau ein {{player}}' : null;
    case 'rule':
    case 'curse':
      if (!task.rounds || task.rounds < 1) return `${task.kind} ohne rounds`;
      return !task.endContent || !task.endContentEn ? `${task.kind} ohne endContent` : null;
    case 'timer':
      return !task.seconds || task.seconds < 1 ? 'timer ohne seconds' : null;
    default:
      return null;
  }
}

function collectTasks() {
  const categories = buildCategories();
  const seen = new Set<string>();
  const invalid: string[] = [];
  const result: { category: CategorySeed; tasks: DefaultTask[] }[] = [];

  for (const category of categories) {
    const tasks: DefaultTask[] = [];
    let duplicates = 0;

    for (const raw of category.tasks) {
      const de = normalize(raw.content);
      const en = normalize(raw.contentEn ?? '');
      if (!de) continue;
      if (!en) {
        invalid.push(`${category.name}: keine englische Übersetzung für "${de}"`);
        continue;
      }
      const texts = [de, en, raw.endContent ?? '', raw.endContentEn ?? ''];
      if (texts.some(hasInvalidPlaceholder)) {
        invalid.push(
          `${category.name}: ungültiger Platzhalter, erlaubt sind nur {{player}} und {{sips}}: "${de}"`,
        );
        continue;
      }
      const mismatch = ['{{player}}', '{{sips}}'].find((p) => slots(de, p) !== slots(en, p));
      if (mismatch) {
        invalid.push(
          `${category.name}: ${mismatch} ${slots(de, mismatch)}x im Deutschen, ${slots(en, mismatch)}x im Englischen:\n  "${de}"\n  "${en}"`,
        );
        continue;
      }
      const task: DefaultTask = { ...raw, content: de, contentEn: en };
      const problem = kindProblem(task);
      if (problem) {
        invalid.push(`${category.name}: ${problem}: "${de}"`);
        continue;
      }
      const key = `${task.kind ?? 'task'}:${de}`;
      if (seen.has(key)) {
        duplicates++;
        continue;
      }
      seen.add(key);
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
    throw new Error(`Ungültige Aufgaben:\n${invalid.join('\n')}`);
  }

  return { categories, collected: result };
}

async function seedDrinkTasks() {
  const { categories, collected } = collectTasks();

  await db.transaction(async (tx) => {
    // The adult category used to be called "Spicy". Renaming keeps its id instead of leaving an orphan.
    const existing = await tx
      .select({ name: drinkCategoryTable.name })
      .from(drinkCategoryTable)
      .where(inArray(drinkCategoryTable.name, ['Spicy', 'Sexual']));
    const names = new Set(existing.map((row) => row.name));
    if (names.has('Spicy') && !names.has('Sexual')) {
      await tx
        .update(drinkCategoryTable)
        .set({ name: 'Sexual', updatedAt: new Date() })
        .where(eq(drinkCategoryTable.name, 'Spicy'));
      console.log('Kategorie Spicy in Sexual umbenannt.');
    } else if (names.has('Spicy')) {
      console.warn(
        'Kategorie Spicy existiert neben Sexual noch in der DB und wird nicht angezeigt.',
      );
    }

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

      const values = tasks.map((content) => ({ categoryId: row.id, content }));
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
