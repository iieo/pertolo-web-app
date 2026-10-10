import { db } from '@/db';
import { mostLikelyToTable } from '@/db/schema';
import { MostLikelyToClient } from './most-likely-to-client';

export const dynamic = 'force-dynamic';

export default async function MostLikelyToGame() {
  const questions = await db
    .select({
      id: mostLikelyToTable.id,
      question: mostLikelyToTable.question,
      questionEn: mostLikelyToTable.questionEn,
      category: mostLikelyToTable.category,
    })
    .from(mostLikelyToTable);

  if (questions.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-black flex items-center justify-center px-6 text-white/70 text-center">
        Keine Fragen gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <MostLikelyToClient questions={questions} />;
}
