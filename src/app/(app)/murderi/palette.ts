const INK = '#111111';
const WHITE = '#FFFFFF';

// Text colors meet WCAG AA (>= 4.5:1) against their background.
const COLORS = [
  { bg: '#4338CA', fg: WHITE },
  { bg: '#FFB703', fg: INK },
  { bg: '#0F766E', fg: WHITE },
  { bg: '#06D6A0', fg: INK },
  { bg: '#7B2CBF', fg: WHITE },
  { bg: '#FB8500', fg: INK },
  { bg: '#0077B6', fg: WHITE },
  { bg: '#F15BB5', fg: INK },
  { bg: '#2D6A4F', fg: WHITE },
  { bg: '#4CC9F0', fg: INK },
] as const;

export type Color = (typeof COLORS)[number];

// Stable per name, so a new target also shows up as a new color.
export function colorFor(name: string): Color {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length]!;
}

export const WIN_COLOR: Color = { bg: '#FFB703', fg: INK };
