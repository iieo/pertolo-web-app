import type { NeverHaveIEverCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'statement' | 'end';

export type CategoryKey = NeverHaveIEverCategory;

export type Statement = {
  id: string;
  statement: string;
  statementEn: string;
  category: CategoryKey;
};
