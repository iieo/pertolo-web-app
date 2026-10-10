import { CategoryKey } from './types';

export const MAX_QUESTIONS = 200;

export const CATEGORY_KEYS: CategoryKey[] = [
  'normal',
  'funny',
  'gross',
  'deep',
  'crazy',
  'party',
  'coworkers',
  'dilemma',
  'sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'sexual');
