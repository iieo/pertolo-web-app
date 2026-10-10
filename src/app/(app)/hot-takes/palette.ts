import { type GameColor, paletteColor, WHITE } from '@/components/game/palette';

import type { Choice, CategoryKey } from './types';

// Statement backgrounds leave out greens and deep reds, so they never blend into the answer areas.
const STATEMENT_COLORS: GameColor[] = [1, 2, 5, 4, 11, 8, 7, 9].map(paletteColor);

export function statementColor(index: number): GameColor {
  return STATEMENT_COLORS[index % STATEMENT_COLORS.length]!;
}

export const ANSWER_COLORS: Record<Choice, GameColor> = {
  agree: { bg: '#2D6A4F', fg: WHITE },
  disagree: { bg: '#9B2226', fg: WHITE },
};

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  normal: 8,
  food: 5,
  love: 7,
  work: 6,
  popculture: 4,
  lifestyle: 3,
  party: 1,
  unpopular: 9,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
