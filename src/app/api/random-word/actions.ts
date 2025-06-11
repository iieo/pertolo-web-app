import { db } from '@/db';
import { impostorWordsTable } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function dbGetRandomWords(count: number = 1) {
  // Ensure count is between 1 and 100
  const validCount = Math.min(Math.max(count, 1), 100);
  
  const words = await db
    .select({
      word: impostorWordsTable.word,
    })
    .from(impostorWordsTable)
    .orderBy(sql`RANDOM()`)
    .limit(validCount);
    
  if (words.length === 0) {
    return { success: false, error: 'No words found' };
  }
  
  return { success: true, data: words.map(w => w.word) };
}
