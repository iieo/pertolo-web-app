import type { TwoHundredQuestionCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'question' | 'end';

export type CategoryKey = TwoHundredQuestionCategory;

export type Question = {
  id: string;
  question: string;
  questionEn: string | null;
  category: CategoryKey;
};
