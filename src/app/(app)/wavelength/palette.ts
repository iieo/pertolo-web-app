import { type GameColor, paletteColor } from '@/components/game/palette';

import type { CategoryKey } from './types';

const ROUND_COLORS: GameColor[] = [2, 1, 4, 3, 8, 5, 6, 7, 10, 11, 0, 9].map(paletteColor);

export function roundColor(index: number): GameColor {
  return ROUND_COLORS[index % ROUND_COLORS.length]!;
}

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  normal: 8,
  food: 5,
  popculture: 4,
  people: 3,
  abstract: 6,
  party: 1,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
