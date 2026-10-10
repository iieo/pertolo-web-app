import { CategoryKey } from './types';

export const CATEGORY_KEYS: CategoryKey[] = [
  'normal',
  'food',
  'popculture',
  'people',
  'abstract',
  'party',
  'sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'sexual');

export const ROUND_COUNTS = [5, 10, 15] as const;
export type RoundCount = (typeof ROUND_COUNTS)[number];

export const TEAM_COUNTS = [1, 2] as const;
export type TeamCount = (typeof TEAM_COUNTS)[number];
