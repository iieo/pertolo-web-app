import { db } from '@/db';
import { imposterCategoriesTable, impostorWordsTable } from '@/db/schema';

const words = ['word'];

const categoryId = '';

async function listCategories() {
  const categories = await db.select().from(imposterCategoriesTable);
  console.log('Categories:', categories);
}

async function main() {
  await listCategories();
  await importImposterWords();
  process.exit(0);
}

async function importImposterWords() {
  const total = words.length;
  let count = 0;
  for (const word of words) {
    count++;
    await db.insert(impostorWordsTable).values({
      word,
      categoryId,
    });
    console.log(`Imported word: ${word} (${count}/${total})`);
  }
  console.log('Imposter words imported successfully.');
}

main();
