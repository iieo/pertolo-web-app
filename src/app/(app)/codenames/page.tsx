import { db } from '@/db';
import { codenamesWordsTable } from '@/db/schema';

import { CodenamesClient } from './codenames-client';

export const dynamic = 'force-dynamic';

export default async function CodenamesGame() {
  const words = await db
    .select({
      id: codenamesWordsTable.id,
      word: codenamesWordsTable.word,
      wordEn: codenamesWordsTable.wordEn,
      category: codenamesWordsTable.category,
    })
    .from(codenamesWordsTable);

  if (words.length === 0) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-black px-6 text-center text-white/70">
        Keine Wörter gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <CodenamesClient words={words} />;
}
