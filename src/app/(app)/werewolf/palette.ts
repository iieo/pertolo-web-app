import { type GameColor, INK, WHITE } from '@/components/game/palette';

import type { Winner } from './lib/engine';
import type { Role } from './lib/roles';

/** `muted` is the secondary text color; it keeps WCAG AA (>= 4.5:1) on `bg`. */
export type Color = GameColor & { muted: string };

export const BLACK: Color = { bg: '#000000', fg: WHITE, muted: 'rgba(255,255,255,0.6)' };
// Night and every night action share one background, so from afar an acting phone looks like any other.
export const NIGHT: Color = { bg: '#0B1026', fg: WHITE, muted: '#AEB6D6' };
export const DAY: Color = { bg: '#FFB703', fg: INK, muted: INK };
export const VOTE: Color = { bg: '#C1121F', fg: WHITE, muted: WHITE };
export const HUNTER: Color = { bg: '#FB8500', fg: INK, muted: INK };

export const END_COLORS: Record<Winner, Color> = {
  village: { bg: '#06D6A0', fg: INK, muted: INK },
  wolves: { bg: '#9D0208', fg: WHITE, muted: WHITE },
  lovers: { bg: '#F15BB5', fg: INK, muted: INK },
  angel: { bg: '#BDE0FE', fg: INK, muted: INK },
  piper: { bg: '#80B918', fg: INK, muted: INK },
  white_werewolf: { bg: '#E9ECEF', fg: INK, muted: INK },
  serial_killer: { bg: '#540B0E', fg: WHITE, muted: WHITE },
  none: { bg: '#3A3A3A', fg: WHITE, muted: WHITE },
};

export const ROLE_COLORS: Record<Role, GameColor> = {
  werewolf: { bg: '#D62839', fg: WHITE },
  villager: { bg: '#FFB703', fg: INK },
  seer: { bg: '#4338CA', fg: WHITE },
  witch: { bg: '#7B2CBF', fg: WHITE },
  protector: { bg: '#0F766E', fg: WHITE },
  hunter: { bg: '#FB8500', fg: INK },
  cupid: { bg: '#F15BB5', fg: INK },
  elder: { bg: '#2D6A4F', fg: WHITE },
  idiot: { bg: '#4CC9F0', fg: INK },
  wild_child: { bg: '#E76F51', fg: INK },
  big_bad_wolf: { bg: '#9D0208', fg: WHITE },
  wolf_cub: { bg: '#F07167', fg: INK },
  infect_father: { bg: '#6A040F', fg: WHITE },
  wolf_seer: { bg: '#B5179E', fg: WHITE },
  traitor: { bg: '#5C677D', fg: WHITE },
  fox: { bg: '#F77F00', fg: INK },
  bear_tamer: { bg: '#8B5E34', fg: WHITE },
  knight: { bg: '#495057', fg: WHITE },
  scapegoat: { bg: '#CDB4DB', fg: INK },
  mayor: { bg: '#FFD166', fg: INK },
  detective: { bg: '#1D3557', fg: WHITE },
  priest: { bg: '#F1FAEE', fg: INK },
  sisters: { bg: '#FF8FAB', fg: INK },
  brothers: { bg: '#457B9D', fg: WHITE },
  cursed: { bg: '#3C096C', fg: WHITE },
  red_riding_hood: { bg: '#C1121F', fg: WHITE },
  wanderer: { bg: '#90E0EF', fg: INK },
  grumpy_grandma: { bg: '#A98467', fg: INK },
  stuttering_judge: { bg: '#3A5A40', fg: WHITE },
  apprentice_seer: { bg: '#7C83FD', fg: INK },
  lycan: { bg: '#774936', fg: WHITE },
  beholder: { bg: '#00B4D8', fg: INK },
  white_werewolf: { bg: '#E9ECEF', fg: INK },
  serial_killer: { bg: '#343A40', fg: WHITE },
  piper: { bg: '#80B918', fg: INK },
  angel: { bg: '#BDE0FE', fg: INK },
};
