import { type GameColor, INK, paletteColor, WHITE } from '@/components/game/palette';

import type { Mode } from './settings';

export type RoundColor = GameColor & { highlight: string };

// Both fg and highlight reach at least 4.5:1 against bg, and the highlight differs in hue from fg.
const ROUND_COLORS: readonly RoundColor[] = [
  { bg: '#4338CA', fg: WHITE, highlight: '#FFEA00' },
  { bg: '#FFB703', fg: INK, highlight: '#2A00B8' },
  { bg: '#7B2CBF', fg: WHITE, highlight: '#FFEA00' },
  { bg: '#06D6A0', fg: INK, highlight: '#2A00B8' },
  { bg: '#2D6A4F', fg: WHITE, highlight: '#FFEA00' },
  { bg: '#4CC9F0', fg: INK, highlight: '#8B0000' },
];

export function roundColor(index: number): RoundColor {
  return ROUND_COLORS[index % ROUND_COLORS.length]!;
}

const MODE_COLOR_INDEX: Record<Mode, number> = { listen: 4, read: 1, quiz: 3 };

export function modeColor(mode: Mode): GameColor {
  return paletteColor(MODE_COLOR_INDEX[mode]);
}
