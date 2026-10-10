import { db } from '@/db';
import { neverHaveIEverTable } from '@/db/schema';
import { NeverHaveIEverClient } from './never-have-i-ever-client';

export const dynamic = 'force-dynamic';

export default async function NeverHaveIEverGame() {
  const statements = await db
    .select({
      id: neverHaveIEverTable.id,
      statement: neverHaveIEverTable.statement,
      statementEn: neverHaveIEverTable.statementEn,
      category: neverHaveIEverTable.category,
    })
    .from(neverHaveIEverTable);

  if (statements.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-black flex items-center justify-center px-6 text-white/70 text-center">
        Keine Aussagen gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <NeverHaveIEverClient statements={statements} />;
}
