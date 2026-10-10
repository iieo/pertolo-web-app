import { type GameColor, INK, paletteColor, WHITE } from '@/components/game/palette';

import type { CardKind, CategoryKey } from './types';

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  Normal: 8,
  Party: 5,
  Duell: 6,
  Wahrheit: 1,
  Chaos: 4,
  Wild: 7,
  Sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}

// Each special kind owns one color, so a card is recognizable before anyone reads it.
// All pairs meet WCAG AA. Plain tasks rotate through the shared palette.
export const KIND_COLORS = {
  versusA: { bg: '#D62839', fg: WHITE },
  versusB: { bg: '#4338CA', fg: WHITE },
  never: { bg: '#FFB703', fg: INK },
  vote: { bg: '#06D6A0', fg: INK },
  group: { bg: '#FB8500', fg: INK },
  question: { bg: '#F15BB5', fg: INK },
  rule: { bg: '#14213D', fg: WHITE },
  curse: { bg: '#2B0A3D', fg: WHITE },
  category: { bg: '#0077B6', fg: WHITE },
  timer: { bg: '#4CC9F0', fg: INK },
  timeUp: { bg: '#D62839', fg: WHITE },
  roulette: { bg: '#7B2CBF', fg: WHITE },
  double: { bg: '#2D6A4F', fg: WHITE },
} satisfies Record<string, GameColor>;

export function taskColor(index: number): GameColor {
  return paletteColor(index);
}

export function cardColor(kind: CardKind, index: number): GameColor {
  switch (kind) {
    case 'task':
      return taskColor(index);
    case 'versus':
      return KIND_COLORS.versusA;
    case 'ruleEnd':
      return KIND_COLORS.rule;
    case 'curseEnd':
      return KIND_COLORS.curse;
    default:
      return KIND_COLORS[kind];
  }
}
