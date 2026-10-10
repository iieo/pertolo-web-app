import { CategoryKey } from './types';

export const MAX_STATEMENTS = 200;

export const CATEGORY_KEYS: CategoryKey[] = [
  'normal',
  'party',
  'travel',
  'love',
  'food',
  'embarrassing',
  'school',
  'crazy',
  'deep',
  'sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'sexual');
