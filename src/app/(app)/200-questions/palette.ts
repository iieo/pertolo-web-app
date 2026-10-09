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

export const NEUTRAL_COLOR = { bg: '#000000', fg: WHITE };

export function questionColor(index: number): QuestionColor {
  return QUESTION_COLORS[index % QUESTION_COLORS.length]!;
}
