import path from 'path';
import fs from 'fs';
import { db } from '@/db';
import { imposterCategoriesTable, impostorWordsTable } from '@/db/schema';

async function seedImpostorWords() {
  const data = fs.readFileSync(path.join(__dirname, 'imposter-words.json'), 'utf-8');

  const jsonObject = JSON.parse(data);

  for (const key of Object.keys(jsonObject)) {
    const wordlist = jsonObject[key];
    // You can process wordlist here
    const [insertedCategory] = await db
      .insert(imposterCategoriesTable)
      .values({
        name: key,
      })
      .returning();

    if (!insertedCategory) {
      throw new Error(`Failed to insert category: ${key}`);
    }

    const categoryId = insertedCategory.id;

    await Promise.all(
      wordlist.map(async (word: string) => {
        await db.insert(impostorWordsTable).values({
          word,
          categoryId,
        });
      }),
    );
  }
}

seedImpostorWords()
  .then(() => {
    console.log('Seeding completed.');
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
  });
