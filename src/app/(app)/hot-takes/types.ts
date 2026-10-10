import type { HotTakeCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'question' | 'end';

export type CategoryKey = HotTakeCategory;

export type Choice = 'agree' | 'disagree';

export type Votes = { votesAgree: number; votesDisagree: number };

export type Take = Votes & {
  id: string;
  statement: string;
  statementEn: string;
  category: CategoryKey;
};
