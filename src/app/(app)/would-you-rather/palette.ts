import type { CategoryKey } from './types';

const INK = '#111111';
const WHITE = '#FFFFFF';

// Text colors meet WCAG AA (>= 4.5:1) against their background. Dark and light entries alternate,
// so neighbouring pairs always contrast with each other.
const COLORS = [
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

export type Color = (typeof COLORS)[number];

function color(index: number): Color {
  return COLORS[index % COLORS.length]!;
}

export function questionColors(index: number): { top: Color; bottom: Color } {
  return { top: color(index * 2), bottom: color(index * 2 + 1) };
}

// Dimmed backgrounds always get white text, because dark text drops below AA once darkened.
export function dimmed(c: Color) {
  return { bg: `color-mix(in srgb, ${c.bg} 45%, black)`, fg: WHITE };
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

export function categoryColor(key: CategoryKey | 'mixed'): Color {
  return color(CATEGORY_COLOR_INDEX[key]);
}
