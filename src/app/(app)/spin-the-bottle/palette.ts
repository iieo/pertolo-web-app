import { type GameColor, INK, paletteColor, PALETTE, WHITE } from '@/components/game/palette';

import type { Mode } from './types';

const MODE_COLOR_INDEX: Record<Mode, number> = { bottle: 10, picker: 7 };

export function modeColor(mode: Mode): GameColor {
  return paletteColor(MODE_COLOR_INDEX[mode]);
}

export const BOTTLE_SCREEN: GameColor = paletteColor(MODE_COLOR_INDEX.bottle);

export const PICKER_SCREEN: GameColor = { bg: '#000000', fg: WHITE };

export function fingerColor(index: number): GameColor {
  return PALETTE[index % PALETTE.length]!;
}

// Light colors only, so the team numbers stay readable on the black picker screen.
export const TEAM_COLORS: readonly GameColor[] = [
  { bg: '#FFB703', fg: INK },
  { bg: '#4CC9F0', fg: INK },
  { bg: '#F15BB5', fg: INK },
  { bg: '#06D6A0', fg: INK },
];
