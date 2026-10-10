import type { WouldYouRatherCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'question' | 'end';

export type CategoryKey = WouldYouRatherCategory;

export type Choice = 'a' | 'b';

export type Votes = { votesA: number; votesB: number };

export type Question = Votes & {
  id: string;
  optionA: string;
  optionB: string;
  optionAEn: string;
  optionBEn: string;
  category: CategoryKey;
};
