import { CategoryKey, FuseLength } from './types';

export const MAX_PROMPTS = 200;

export const CATEGORY_KEYS: CategoryKey[] = [
  'normal',
  'food',
  'animals',
  'popculture',
  'places',
  'music',
  'sports',
  'brands',
  'party',
  'sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'sexual');

export const FUSE_LENGTHS: FuseLength[] = ['short', 'normal', 'long'];

const FUSE_RANGES_SECONDS: Record<FuseLength, [number, number]> = {
  short: [10, 25],
  normal: [20, 45],
  long: [35, 70],
};

export function randomFuseMs(length: FuseLength) {
  const [min, max] = FUSE_RANGES_SECONDS[length];
  return (min + Math.random() * (max - min)) * 1000;
}
