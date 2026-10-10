import { db } from '@/db';
import { headsUpWordsTable } from '@/db/schema';
import { HeadsUpClient } from './heads-up-client';

export const dynamic = 'force-dynamic';

export default async function HeadsUpGame() {
  const words = await db
    .select({
      id: headsUpWordsTable.id,
      word: headsUpWordsTable.word,
      wordEn: headsUpWordsTable.wordEn,
      category: headsUpWordsTable.category,
    })
    .from(headsUpWordsTable);

  if (words.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-black flex items-center justify-center px-6 text-white/70 text-center">
        Keine Wörter gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <HeadsUpClient words={words} />;
}
