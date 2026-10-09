import { db } from '@/db';
import { TwoHundredQuestionCategory, twoHundredQuestionsTable } from '@/db/schema';
import { count, notInArray, sql } from 'drizzle-orm';
import { exit } from 'process';

import { coworkersQuestions } from './coworkers';
import { coworkersQuestionsEn } from './en/coworkers';
import { crazyQuestionsEn } from './en/crazy';
import { deepQuestionsEn } from './en/deep';
import { exposedQuestionsEn } from './en/exposed';
import { friendlyQuestionsEn } from './en/friendly';
import { futureQuestionsEn } from './en/future';
import { interactiveQuestionsEn } from './en/interactive';
import { normalQuestionsEn } from './en/normal';
import { partyQuestionsEn } from './en/party';
import { roastQuestionsEn } from './en/roast';
import { sexualQuestionsEn } from './en/sexual';
import { crazyQuestions } from './crazy';
import { deepQuestions } from './deep';
import { exposedQuestions } from './exposed';
import { friendlyQuestions } from './friendly';
import { futureQuestions } from './future';
import { interactiveQuestions } from './interactive';
import { normalQuestions } from './normal';
import { partyQuestions } from './party';
import { roastQuestions } from './roast';
import { sexualQuestions } from './sexual';

const questionsByCategory: Record<TwoHundredQuestionCategory, string[]> = {
  normal: normalQuestions,
  friendly: friendlyQuestions,
  coworkers: coworkersQuestions,
  interactive: interactiveQuestions,
  crazy: crazyQuestions,
  party: partyQuestions,
  roast: roastQuestions,
  exposed: exposedQuestions,
  future: futureQuestions,
  deep: deepQuestions,
  sexual: sexualQuestions,
};

const questionsEnByCategory: Record<TwoHundredQuestionCategory, string[]> = {
  normal: normalQuestionsEn,
  friendly: friendlyQuestionsEn,
  coworkers: coworkersQuestionsEn,
  interactive: interactiveQuestionsEn,
  crazy: crazyQuestionsEn,
  party: partyQuestionsEn,
  roast: roastQuestionsEn,
  exposed: exposedQuestionsEn,
  future: futureQuestionsEn,
  deep: deepQuestionsEn,
  sexual: sexualQuestionsEn,
};

const BATCH_SIZE = 500;

function validateTranslations() {
  const mismatches = (Object.keys(questionsByCategory) as TwoHundredQuestionCategory[])
    .filter(
      (category) => questionsEnByCategory[category].length !== questionsByCategory[category].length,
    )
    .map(
      (category) =>
        `${category}: ${questionsByCategory[category].length} deutsch, ${questionsEnByCategory[category].length} englisch`,
    );

  if (mismatches.length > 0) {
    throw new Error(
      `Anzahl der englischen Fragen passt nicht zu den deutschen, Sync abgebrochen:\n${mismatches.join('\n')}`,
    );
  }
}

function collectRows() {
  validateTranslations();

  const rows: {
    question: string;
    questionEn: string;
    category: TwoHundredQuestionCategory;
  }[] = [];
  const seen = new Map<string, TwoHundredQuestionCategory>();
  const duplicates: string[] = [];

  for (const [category, questions] of Object.entries(questionsByCategory) as [
    TwoHundredQuestionCategory,
    string[],
  ][]) {
    console.log(`${category}: ${questions.length} in Dateien`);
    const questionsEn = questionsEnByCategory[category];
    for (const [index, question] of questions.entries()) {
      const existing = seen.get(question);
      if (existing) {
        duplicates.push(`"${question}" (${existing} und ${category})`);
        continue;
      }
      seen.set(question, category);
      rows.push({ question, questionEn: questionsEn[index]!, category });
    }
  }

  if (duplicates.length > 0) {
    throw new Error(`Doppelte Fragen in den Dateien:\n${duplicates.join('\n')}`);
  }
  if (rows.length === 0) {
    throw new Error('Keine Fragen in den Dateien gefunden, Sync abgebrochen.');
  }

  return rows;
}

async function seedTwoHundredQuestions() {
  const rows = collectRows();
  const questions = rows.map((row) => row.question);

  const deleted = await db.transaction(async (tx) => {
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      await tx
        .insert(twoHundredQuestionsTable)
        .values(rows.slice(i, i + BATCH_SIZE))
        .onConflictDoUpdate({
          target: twoHundredQuestionsTable.question,
          set: {
            category: sql`excluded.category`,
            questionEn: sql`excluded.question_en`,
          },
        });
    }

    return tx
      .delete(twoHundredQuestionsTable)
      .where(notInArray(twoHundredQuestionsTable.question, questions))
      .returning({ id: twoHundredQuestionsTable.id });
  });

  console.log(`${deleted.length} gelöscht`);

  const counts = await db
    .select({ category: twoHundredQuestionsTable.category, count: count() })
    .from(twoHundredQuestionsTable)
    .groupBy(twoHundredQuestionsTable.category)
    .orderBy(twoHundredQuestionsTable.category);

  console.log('Stand in der DB:');
  for (const row of counts) {
    console.log(`${row.category}: ${row.count}`);
  }
  console.log(`Synced ${rows.length} 200 Questions.`);
}

seedTwoHundredQuestions()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    exit(1);
  });
