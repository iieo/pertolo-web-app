import { type GameColor, paletteColor } from '@/components/game/palette';

import type { CategoryKey } from './types';

export function questionColor(index: number): GameColor {
  return paletteColor(index);
}

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  normal: 8,
  friendly: 3,
  coworkers: 6,
  interactive: 1,
  crazy: 4,
  party: 5,
  roast: 9,
  exposed: 7,
  future: 11,
  deep: 10,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
