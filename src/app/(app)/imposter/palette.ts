import { type GameColor, paletteColor } from '@/components/game/palette';

export const RANDOM_COLOR = paletteColor(2);
export const PLAYING_COLOR = paletteColor(5);

export function categoryColor(index: number): GameColor {
  return paletteColor(index + 3);
}

export function playerColor(index: number): GameColor {
  return paletteColor(index * 5);
}
