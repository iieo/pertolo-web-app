export const ROLES = [
  'werewolf',
  'villager',
  'seer',
  'witch',
  'protector',
  'hunter',
  'cupid',
  'elder',
  'idiot',
  'wild_child',
  'big_bad_wolf',
  'wolf_cub',
  'infect_father',
  'wolf_seer',
  'traitor',
  'fox',
  'bear_tamer',
  'knight',
  'scapegoat',
  'mayor',
  'detective',
  'priest',
  'sisters',
  'brothers',
  'cursed',
  'red_riding_hood',
  'wanderer',
  'grumpy_grandma',
  'stuttering_judge',
  'apprentice_seer',
  'lycan',
  'beholder',
  'white_werewolf',
  'serial_killer',
  'piper',
  'angel',
] as const;

export type Role = (typeof ROLES)[number];
export type Team = 'village' | 'wolves' | 'solo';
export type RolesConfig = Record<Role, number>;

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 20;

/** `max` null = unlimited; `group` = the count must be exactly this or 0. */
export const ROLE_INFO: Record<Role, { team: Team; max: number | null; group?: number }> = {
  werewolf: { team: 'wolves', max: null },
  villager: { team: 'village', max: null },
  seer: { team: 'village', max: 1 },
  witch: { team: 'village', max: 1 },
  protector: { team: 'village', max: 1 },
  hunter: { team: 'village', max: 1 },
  cupid: { team: 'village', max: 1 },
  elder: { team: 'village', max: 1 },
  idiot: { team: 'village', max: 1 },
  wild_child: { team: 'village', max: 1 },
  big_bad_wolf: { team: 'wolves', max: 1 },
  wolf_cub: { team: 'wolves', max: 1 },
  infect_father: { team: 'wolves', max: 1 },
  wolf_seer: { team: 'wolves', max: 1 },
  traitor: { team: 'wolves', max: 1 },
  fox: { team: 'village', max: 1 },
  bear_tamer: { team: 'village', max: 1 },
  knight: { team: 'village', max: 1 },
  scapegoat: { team: 'village', max: 1 },
  mayor: { team: 'village', max: 1 },
  detective: { team: 'village', max: 1 },
  priest: { team: 'village', max: 1 },
  sisters: { team: 'village', max: 2, group: 2 },
  brothers: { team: 'village', max: 3, group: 3 },
  cursed: { team: 'village', max: 1 },
  red_riding_hood: { team: 'village', max: 1 },
  wanderer: { team: 'village', max: 1 },
  grumpy_grandma: { team: 'village', max: 1 },
  stuttering_judge: { team: 'village', max: 1 },
  apprentice_seer: { team: 'village', max: 1 },
  lycan: { team: 'village', max: 1 },
  beholder: { team: 'village', max: 1 },
  white_werewolf: { team: 'solo', max: 1 },
  serial_killer: { team: 'solo', max: 1 },
  piper: { team: 'solo', max: 1 },
  angel: { team: 'solo', max: 1 },
};

/** Wolf roles that take part in the kill from night 1 (the wolf seer only once alone). */
export const WOLF_KILLER_ROLES: readonly Role[] = [
  'werewolf',
  'big_bad_wolf',
  'wolf_cub',
  'infect_father',
];

export const SOLO_ROLES: readonly Role[] = ['white_werewolf', 'serial_killer', 'piper', 'angel'];
export const MAX_SOLOS = 3;

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

export function emptyRoles(): RolesConfig {
  return Object.fromEntries(ROLES.map((r) => [r, 0])) as RolesConfig;
}

export function presetFor(playerCount: number): RolesConfig {
  const n = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, playerCount));
  const roles = emptyRoles();
  const wolves = n >= 19 ? 5 : n >= 15 ? 4 : n >= 10 ? 3 : n >= 7 ? 2 : 1;
  roles.werewolf = n >= 13 ? wolves - 1 : wolves;
  if (n >= 13) roles.big_bad_wolf = 1;
  roles.seer = 1;
  if (n >= 4) roles.witch = 1;
  if (n >= 6) roles.hunter = 1;
  if (n >= 8) {
    roles.cupid = 1;
    roles.mayor = 1;
  }
  if (n >= 9) roles.protector = 1;
  if (n >= 11) roles.fox = 1;
  if (n >= 12) roles.elder = 1;
  if (n >= 13) roles.bear_tamer = 1;
  if (n >= 14) roles.piper = 1;
  if (n >= 16) roles.idiot = 1;
  if (n >= 17) roles.wild_child = 1;
  if (n >= 18) roles.knight = 1;
  if (n >= 20) roles.priest = 1;
  roles.villager = n - roleTotal(roles);
  return roles;
}

export function roleTotal(config: RolesConfig): number {
  return ROLES.reduce((sum, r) => sum + (config[r] ?? 0), 0);
}

export type RolesError =
  | 'TOO_FEW_PLAYERS'
  | 'TOO_MANY_PLAYERS'
  | 'ROLE_COUNT_MISMATCH'
  | 'NO_WOLVES'
  | 'TOO_MANY_WOLVES'
  | 'ROLE_LIMIT'
  | 'GROUP_SIZE'
  | 'TOO_MANY_SOLOS';

export function validateRoles(input: RolesConfig, playerCount: number): RolesError | null {
  const config = { ...emptyRoles(), ...input };
  if (playerCount < MIN_PLAYERS) return 'TOO_FEW_PLAYERS';
  if (playerCount > MAX_PLAYERS) return 'TOO_MANY_PLAYERS';
  for (const r of ROLES) {
    const { max, group } = ROLE_INFO[r];
    if (max !== null && config[r] > max) return 'ROLE_LIMIT';
    if (group !== undefined && config[r] !== 0 && config[r] !== group) return 'GROUP_SIZE';
  }
  if (roleTotal(config) !== playerCount) return 'ROLE_COUNT_MISMATCH';
  if (WOLF_KILLER_ROLES.every((r) => config[r] < 1)) return 'NO_WOLVES';
  const killers =
    ROLES.filter((r) => ROLE_INFO[r].team === 'wolves' && r !== 'traitor').reduce(
      (sum, r) => sum + config[r],
      0,
    ) + config.white_werewolf;
  if (killers * 2 >= playerCount) return 'TOO_MANY_WOLVES';
  if (SOLO_ROLES.reduce((sum, r) => sum + config[r], 0) > MAX_SOLOS) return 'TOO_MANY_SOLOS';
  return null;
}

/** Sanitizes untrusted input into a full config; null if malformed. */
export function normalizeRoles(input: unknown): RolesConfig | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null;
  const roles = emptyRoles();
  for (const [key, value] of Object.entries(input)) {
    if (!isRole(key)) return null;
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) return null;
    const max = ROLE_INFO[key].max ?? MAX_PLAYERS;
    if (value > max) return null;
    roles[key] = value;
  }
  return roles;
}

export function rolesToList(config: RolesConfig): Role[] {
  return ROLES.flatMap((r) => Array.from({ length: config[r] }, () => r));
}
