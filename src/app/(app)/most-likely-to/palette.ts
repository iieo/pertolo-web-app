import { type GameColor, paletteColor } from '@/components/game/palette';

import type { CategoryKey } from './types';

export function questionColor(index: number): GameColor {
  return paletteColor(index);
}

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 7,
  normal: 8,
  party: 1,
  friends: 3,
  work: 6,
  love: 5,
  crazy: 4,
  future: 11,
  roast: 9,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
