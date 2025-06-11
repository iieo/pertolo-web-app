import { db } from '@/db';
import { imposterCategoriesTable, impostorWordsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

const words = [
  'Tresor',
  'Feuerlöscher',
  'Rauchmelder',
  'Kohlenmonoxidmelder',
  'Verbandsschrank',
  'Werkzeugwand',
  'Regalbrett',
  'Schublade',
  'Box',
  'Kiste',
  'Behälter',
  'Organizer',
  'Mülleimer (Küche)',
  'Komposteimer',
  'Recyclingtonne',
  'Gartenschlauchwagen',
  'Gartenspritze',
  'Gartendüse',
  'Schlauchverbinder',
  'Spaten',
  'Harke',
  'Rechen',
  'Gartenkralle',
  'Jäteisen',
  'Blumenkelle',
  'Pflanzholz',
  'Sämaschine',
  'Setzholz',
  'Baumschere',
  'Astschere',
  'Heckenschere (Hand)',
  'Rasenkantenschneider',
  'Rasenmäher (Hand)',
  'Laubrechen',
  'Besen (Garten)',
  'Schneeschieber',
  'Streuwagen',
  'Vogelfutterhaus',
  'Nistkasten',
  'Wildkamera',
];

const categoryId = '7d95d016-d773-47fe-bc07-0a5a2f5a3d04';

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
