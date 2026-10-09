import { db } from '@/db';
import { TwoHundredQuestionCategory, twoHundredQuestionsTable } from '@/db/schema';
import { exit } from 'process';

import { coworkersQuestions } from './coworkers';
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

async function seedTwoHundredQuestions() {
  for (const [category, questions] of Object.entries(questionsByCategory) as [
    TwoHundredQuestionCategory,
    string[],
  ][]) {
    if (questions.length === 0) continue;
    const inserted = await db
      .insert(twoHundredQuestionsTable)
      .values(questions.map((question) => ({ question, category })))
      .onConflictDoNothing({ target: twoHundredQuestionsTable.question })
      .returning({ id: twoHundredQuestionsTable.id });
    console.log(`${category}: ${inserted.length} neu, ${questions.length} gesamt`);
  }
  console.log('Seeded 200 Questions.');
  exit(0);
}

seedTwoHundredQuestions();
