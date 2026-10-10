import { CategoryKey } from './types';

export const CATEGORY_KEYS: CategoryKey[] = [
  'everyday',
  'animals',
  'food',
  'movies',
  'celebrities',
  'music',
  'sports',
  'places',
  'jobs',
  'brands',
  'sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'sexual');

export const ROUND_LENGTHS = [60, 90, 120] as const;

export type RoundLength = (typeof ROUND_LENGTHS)[number];
