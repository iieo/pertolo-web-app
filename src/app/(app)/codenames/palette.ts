import { type GameColor, INK, paletteColor, WHITE } from '@/components/game/palette';

import type { CategoryKey, Role, Team } from './types';

export const TEAM_COLORS: Record<Team, GameColor> = {
  red: { bg: '#D62839', fg: WHITE },
  blue: { bg: '#0077B6', fg: WHITE },
};

export const ROLE_COLORS: Record<Role, GameColor> = {
  ...TEAM_COLORS,
  neutral: { bg: '#A8A29E', fg: INK },
  assassin: { bg: '#111111', fg: WHITE },
};

export const HIDDEN_CARD: GameColor = { bg: '#F5F5F4', fg: INK };

const CATEGORY_COLOR_INDEX: Record<CategoryKey | 'mixed', number> = {
  mixed: 2,
  classic: 8,
  places: 6,
  food: 5,
  popculture: 4,
  nature: 3,
  sexual: 0,
};

export function categoryColor(key: CategoryKey | 'mixed'): GameColor {
  return paletteColor(CATEGORY_COLOR_INDEX[key]);
}
