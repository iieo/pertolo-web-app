import type { CategoryKey } from './types';

const INK = '#111111';
const WHITE = '#FFFFFF';

// Text colors meet WCAG AA (>= 4.5:1) against their background.
const QUESTION_COLORS = [
  { bg: '#D62839', fg: WHITE },
  { bg: '#FFB703', fg: INK },
  { bg: '#4338CA', fg: WHITE },
  { bg: '#06D6A0', fg: INK },
  { bg: '#7B2CBF', fg: WHITE },
  { bg: '#FB8500', fg: INK },
  { bg: '#0F766E', fg: WHITE },
  { bg: '#F15BB5', fg: INK },
  { bg: '#0077B6', fg: WHITE },
  { bg: '#E76F51', fg: INK },
  { bg: '#2D6A4F', fg: WHITE },
  { bg: '#4CC9F0', fg: INK },
] as const;

export type QuestionColor = (typeof QUESTION_COLORS)[number];

export function questionColor(index: number): QuestionColor {
  return QUESTION_COLORS[index % QUESTION_COLORS.length]!;
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

export function categoryColor(key: CategoryKey | 'mixed'): QuestionColor {
  return questionColor(CATEGORY_COLOR_INDEX[key]);
}
