import type { TwoHundredQuestionCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'read' | 'handover' | 'reveal' | 'end';

export type CategoryKey = TwoHundredQuestionCategory;

export type Question = {
  id: string;
  question: string;
  category: CategoryKey;
};

export type CategoryMeta = {
  key: CategoryKey;
  name: string;
  emoji: string;
  description: string;
};
