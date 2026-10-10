import type { MostLikelyToCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'question' | 'end';

export type CategoryKey = MostLikelyToCategory;

export type Question = {
  id: string;
  question: string;
  questionEn: string;
  category: CategoryKey;
};
