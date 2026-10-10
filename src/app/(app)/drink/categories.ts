import { CategoryKey, DrinkCategory } from './types';

export const CATEGORY_KEYS: CategoryKey[] = [
  'Normal',
  'Party',
  'Duell',
  'Wahrheit',
  'Chaos',
  'Wild',
  'Sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'Sexual');

export function isCategoryKey(name: string): name is CategoryKey {
  return (CATEGORY_KEYS as string[]).includes(name);
}

export function playableCount(category: DrinkCategory, playerCount: number) {
  return category.slotCounts.reduce(
    (sum, { slots, count }) => (slots <= playerCount ? sum + count : sum),
    0,
  );
}
