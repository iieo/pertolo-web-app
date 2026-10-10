import { db } from '@/db';
import { hotTakesTable } from '@/db/schema';
import { HotTakesClient } from './hot-takes-client';

export const dynamic = 'force-dynamic';

export default async function HotTakesGame() {
  const takes = await db
    .select({
      id: hotTakesTable.id,
      statement: hotTakesTable.statement,
      statementEn: hotTakesTable.statementEn,
      category: hotTakesTable.category,
      votesAgree: hotTakesTable.votesAgree,
      votesDisagree: hotTakesTable.votesDisagree,
    })
    .from(hotTakesTable);

  if (takes.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-black flex items-center justify-center px-6 text-white/70 text-center">
        Keine Hot Takes gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <HotTakesClient takes={takes} />;
}
