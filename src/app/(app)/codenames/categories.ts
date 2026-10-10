import type { CategoryKey, Role, Team } from './types';

export const BOARD_SIZE = 25;

export const CATEGORY_KEYS: CategoryKey[] = [
  'classic',
  'places',
  'food',
  'popculture',
  'nature',
  'sexual',
];

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORY_KEYS.filter((key) => key !== 'sexual');

export function otherTeam(team: Team): Team {
  return team === 'red' ? 'blue' : 'red';
}

/** Starting team gets 9 cards, the other 8, plus 7 neutral and 1 assassin. */
export function boardRoles(startingTeam: Team): Role[] {
  return [
    ...Array<Role>(9).fill(startingTeam),
    ...Array<Role>(8).fill(otherTeam(startingTeam)),
    ...Array<Role>(7).fill('neutral'),
    'assassin',
  ];
}
