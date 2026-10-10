export type GameColor = { bg: string; fg: string };

export const WHITE = '#FFFFFF';
export const INK = '#111111';

// Text colors meet WCAG AA (>= 4.5:1) against their background. Dark and light entries alternate,
// so neighbouring entries always contrast with each other.
export const PALETTE: readonly GameColor[] = [
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
];

export function paletteColor(index: number): GameColor {
  return PALETTE[index % PALETTE.length]!;
}

// Strongly darkened backgrounds always get white text, because dark text drops below AA there.
export function dimmed(c: GameColor): GameColor {
  return { bg: `color-mix(in srgb, ${c.bg} 45%, black)`, fg: WHITE };
}

function channels(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
}

function luminance(hex: string) {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function readableText(bg: string) {
  return contrastRatio(bg, WHITE) >= contrastRatio(bg, INK) ? WHITE : INK;
}

/**
 * Darkens a hex color slightly and picks the text color with the higher contrast. At 0.7 every
 * PALETTE entry still reaches AA (the lowest is 4.76:1).
 */
export function shade(c: GameColor, amount = 0.7): GameColor {
  const bg = `#${channels(c.bg)
    .map((v) =>
      Math.round(v * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
  return { bg, fg: readableText(bg) };
}
