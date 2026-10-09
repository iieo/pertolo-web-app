import { db } from '@/db';
import { twoHundredQuestionsTable } from '@/db/schema';
import { TwoHundredQuestionsClient } from './two-hundred-questions-client';

export const dynamic = 'force-dynamic';

export default async function TwoHundredQuestionsGame() {
  const questions = await db
    .select({
      id: twoHundredQuestionsTable.id,
      question: twoHundredQuestionsTable.question,
      questionEn: twoHundredQuestionsTable.questionEn,
      category: twoHundredQuestionsTable.category,
    })
    .from(twoHundredQuestionsTable);

  if (questions.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-black flex items-center justify-center px-6 text-white/70 text-center">
        Keine Fragen gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <TwoHundredQuestionsClient questions={questions} />;
}
