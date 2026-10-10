import { CategoryKey } from './types';

export const MAX_TAKES = 200;

export const CATEGORY_KEYS: CategoryKey[] = [
  'normal',
  'food',
  'love',
  'work',
  'popculture',
  'lifestyle',
  'party',
  'unpopular',
  'sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'sexual');
