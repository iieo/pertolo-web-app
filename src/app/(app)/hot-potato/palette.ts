import { type GameColor, PALETTE, paletteColor, WHITE } from '@/components/game/palette';

import type { CategoryKey } from './types';

// Reds stay reserved for the explosion, so it never looks like a regular prompt.
const PROMPT_COLORS = PALETTE.filter((c) => c.bg !== '#D62839' && c.bg !== '#E76F51');

export function promptColor(index: number): GameColor {
  return PROMPT_COLORS[index % PROMPT_COLORS.length]!;
}

export const BOOM_COLOR: GameColor = { bg: '#D90000', fg: WHITE };

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  normal: 8,
  food: 5,
  animals: 10,
  popculture: 7,
  places: 11,
  music: 4,
  sports: 6,
  brands: 9,
  party: 1,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
