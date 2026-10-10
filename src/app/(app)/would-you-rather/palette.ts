import { type GameColor, paletteColor } from '@/components/game/palette';

import type { CategoryKey } from './types';

export function questionColors(index: number): { top: GameColor; bottom: GameColor } {
  return { top: paletteColor(index * 2), bottom: paletteColor(index * 2 + 1) };
}

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  normal: 8,
  funny: 1,
  gross: 3,
  deep: 10,
  crazy: 4,
  party: 5,
  coworkers: 6,
  dilemma: 9,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
