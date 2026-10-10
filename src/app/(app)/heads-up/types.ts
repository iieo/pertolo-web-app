import type { HeadsUpCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'ready' | 'countdown' | 'playing' | 'result';

export type CategoryKey = HeadsUpCategory;

export type Word = {
  id: string;
  word: string;
  wordEn: string;
  category: CategoryKey;
};

export type RoundResult = { word: Word; correct: boolean };
