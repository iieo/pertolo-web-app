import { db } from '@/db';
import { wouldYouRatherTable } from '@/db/schema';
import { WouldYouRatherClient } from './would-you-rather-client';

export const dynamic = 'force-dynamic';

export default async function WouldYouRatherGame() {
  const questions = await db
    .select({
      id: wouldYouRatherTable.id,
      optionA: wouldYouRatherTable.optionA,
      optionB: wouldYouRatherTable.optionB,
      optionAEn: wouldYouRatherTable.optionAEn,
      optionBEn: wouldYouRatherTable.optionBEn,
      category: wouldYouRatherTable.category,
      votesA: wouldYouRatherTable.votesA,
      votesB: wouldYouRatherTable.votesB,
    })
    .from(wouldYouRatherTable);

  if (questions.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-black flex items-center justify-center px-6 text-white/70 text-center">
        Keine Fragen gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <WouldYouRatherClient questions={questions} />;
}
