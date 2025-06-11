import { db } from '@/db';
import { impostorWordsTable } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function dbGetRandomWord() {
  const [word] = await db
    .select({
      word: impostorWordsTable.word,
    })
    .from(impostorWordsTable)
    .orderBy(sql`RANDOM()`)
    .limit(1);
  if (!word) {
    return { success: false, error: 'No words found' };
  }
  return { success: true, data: word.word };
}
