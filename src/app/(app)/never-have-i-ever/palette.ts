import { type GameColor, paletteColor } from '@/components/game/palette';

import type { CategoryKey } from './types';

export function statementColor(index: number): GameColor {
  return paletteColor(index);
}

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  normal: 8,
  party: 1,
  travel: 6,
  love: 7,
  food: 10,
  embarrassing: 9,
  school: 4,
  crazy: 3,
  deep: 11,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
