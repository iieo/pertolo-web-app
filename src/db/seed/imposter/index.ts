import { db } from '@/db';
import { imposterCategoriesTable, impostorWordsTable } from '@/db/schema';
import { eq, inArray, notInArray } from 'drizzle-orm';
import { exit } from 'process';

import wordsByCategory from '../../../../seed/imposter-words.json';

const MAX_LENGTH = 100;

type CategorySeed = { name: string; words: string[] };

function normalize(text: string) {
  return text.trim().replace(/\s+/g, ' ');
}

function collectCategories() {
  const categories: CategorySeed[] = [];
  const invalid: string[] = [];

  for (const [rawName, rawWords] of Object.entries(wordsByCategory as Record<string, string[]>)) {
    const name = normalize(rawName);
    if (!name || name.length > MAX_LENGTH) {
      invalid.push(`Ungültiger Kategoriename: "${rawName}"`);
      continue;
    }

    const words = new Set<string>();
    let duplicates = 0;
    for (const raw of rawWords) {
      const word = normalize(raw);
      if (!word || word.length > MAX_LENGTH) {
        invalid.push(`${name}: ungültiges Wort "${raw}"`);
        continue;
      }
      if (words.has(word)) {
        duplicates++;
        continue;
      }
      words.add(word);
    }

    if (duplicates > 0) console.warn(`${name}: ${duplicates} Duplikate in der JSON übersprungen`);
    if (words.size === 0) invalid.push(`${name}: keine Wörter`);
    categories.push({ name, words: [...words] });
  }

  if (invalid.length > 0) {
    throw new Error(`Ungültige Einträge in seed/imposter-words.json:\n${invalid.join('\n')}`);
  }
  if (categories.length === 0) {
    throw new Error('Keine Kategorien in seed/imposter-words.json gefunden, Sync abgebrochen.');
  }

  return categories;
}

async function seedImposterWords() {
  const categories = collectCategories();

  const { stats, removedCategories } = await db.transaction(async (tx) => {
    const stats: { name: string; inserted: number; deleted: number; total: number }[] = [];

    for (const category of categories) {
      const [row] = await tx
        .insert(imposterCategoriesTable)
        .values({ name: category.name })
        .onConflictDoUpdate({
          target: imposterCategoriesTable.name,
          set: { name: category.name },
        })
        .returning({ id: imposterCategoriesTable.id });
      if (!row) throw new Error(`Kategorie ${category.name} konnte nicht angelegt werden.`);

      const existing = await tx
        .select({ id: impostorWordsTable.id, word: impostorWordsTable.word })
        .from(impostorWordsTable)
        .where(eq(impostorWordsTable.categoryId, row.id))
        .orderBy(impostorWordsTable.createdAt);

      // The oldest row per word survives, so ids of words that stay never change.
      const wanted = new Set(category.words);
      const kept = new Set<string>();
      const toDelete: string[] = [];
      for (const { id, word } of existing) {
        if (wanted.has(word) && !kept.has(word)) {
          kept.add(word);
        } else {
          toDelete.push(id);
        }
      }
      const toInsert = category.words.filter((word) => !kept.has(word));

      if (toDelete.length > 0) {
        await tx.delete(impostorWordsTable).where(inArray(impostorWordsTable.id, toDelete));
      }
      if (toInsert.length > 0) {
        await tx
          .insert(impostorWordsTable)
          .values(toInsert.map((word) => ({ word, categoryId: row.id })));
      }

      stats.push({
        name: category.name,
        inserted: toInsert.length,
        deleted: toDelete.length,
        total: category.words.length,
      });
    }

    const names = categories.map((c) => c.name);
    const stale = await tx
      .select({ id: imposterCategoriesTable.id, name: imposterCategoriesTable.name })
      .from(imposterCategoriesTable)
      .where(notInArray(imposterCategoriesTable.name, names));

    const removedCategories: { name: string; words: number }[] = [];
    if (stale.length > 0) {
      const staleIds = stale.map((c) => c.id);
      // The FK on impostor_words has no cascade, so the words go first.
      const removedWords = await tx
        .delete(impostorWordsTable)
        .where(inArray(impostorWordsTable.categoryId, staleIds))
        .returning({ categoryId: impostorWordsTable.categoryId });
      await tx.delete(imposterCategoriesTable).where(inArray(imposterCategoriesTable.id, staleIds));

      for (const category of stale) {
        removedCategories.push({
          name: category.name,
          words: removedWords.filter((w) => w.categoryId === category.id).length,
        });
      }
    }

    return { stats, removedCategories };
  });

  for (const s of stats) {
    console.log(`${s.name}: ${s.inserted} eingefügt, ${s.deleted} gelöscht, ${s.total} gesamt`);
  }
  for (const c of removedCategories) {
    console.log(`Kategorie ${c.name} gelöscht (${c.words} Wörter)`);
  }

  const inserted = stats.reduce((sum, s) => sum + s.inserted, 0);
  const deleted =
    stats.reduce((sum, s) => sum + s.deleted, 0) +
    removedCategories.reduce((sum, c) => sum + c.words, 0);
  const total = stats.reduce((sum, s) => sum + s.total, 0);
  console.log(
    `Summe: ${inserted} eingefügt, ${deleted} gelöscht, ${removedCategories.length} Kategorien entfernt. ` +
      `Synced ${total} Imposter-Wörter in ${stats.length} Kategorien.`,
  );
}

seedImposterWords()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
