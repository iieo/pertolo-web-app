import { db } from '@/db';
import { hotPotatoPromptsTable } from '@/db/schema';
import { HotPotatoClient } from './hot-potato-client';

export const dynamic = 'force-dynamic';

export default async function HotPotatoGame() {
  const prompts = await db
    .select({
      id: hotPotatoPromptsTable.id,
      prompt: hotPotatoPromptsTable.prompt,
      promptEn: hotPotatoPromptsTable.promptEn,
      category: hotPotatoPromptsTable.category,
    })
    .from(hotPotatoPromptsTable);

  if (prompts.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-black flex items-center justify-center px-6 text-white/70 text-center">
        Keine Aufgaben gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <HotPotatoClient prompts={prompts} />;
}
