import type { CodenamesCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'playing' | 'end';

export type CategoryKey = CodenamesCategory;

export type Team = 'red' | 'blue';

export type Role = Team | 'neutral' | 'assassin';

export type Word = {
  id: string;
  word: string;
  wordEn: string;
  category: CategoryKey;
};

export type Card = {
  id: string;
  word: string;
  wordEn: string;
  role: Role;
  revealed: boolean;
};

export type EndReason = 'allFound' | 'assassin';
