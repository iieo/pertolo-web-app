import { db } from '@/db';
import { bluffWordsTable } from '@/db/schema';
import { BluffClient } from './bluff-client';

export default async function BluffGame() {
  const words = await db.select().from(bluffWordsTable);

  if (!words || words.length === 0) {
    return <div className="min-h-dvh w-full bg-black flex items-center justify-center text-white text-center">No words found. Please run the seed script!</div>;
  }

  return <BluffClient words={words} />;
}
