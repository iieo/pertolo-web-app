import { type GameColor, paletteColor } from '@/components/game/palette';

// Derived from the word, so the word screen and its secret screen share one color.
export function wordColor(word: string): GameColor {
  let hash = 0;
  for (let i = 0; i < word.length; i++) hash = (hash * 31 + word.charCodeAt(i)) >>> 0;
  return paletteColor(hash);
}
