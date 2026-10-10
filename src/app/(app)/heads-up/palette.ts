import { type GameColor, INK, PALETTE, paletteColor, WHITE } from '@/components/game/palette';

import type { CategoryKey } from './types';

export const CORRECT_COLOR = paletteColor(3);
export const PASS_COLOR = paletteColor(0);
export const TIME_UP_COLOR: GameColor = { bg: WHITE, fg: INK };

// Words never use the flash colors, so a flash always reads as a change of state.
const WORD_COLORS = PALETTE.filter((c) => c !== CORRECT_COLOR && c !== PASS_COLOR);

export function wordColor(index: number): GameColor {
  return WORD_COLORS[index % WORD_COLORS.length]!;
}

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  everyday: 8,
  animals: 10,
  food: 5,
  movies: 4,
  celebrities: 7,
  music: 11,
  sports: 3,
  places: 6,
  jobs: 1,
  brands: 9,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
