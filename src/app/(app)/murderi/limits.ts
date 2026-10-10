export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 50;
export const MAX_NAME_LENGTH = 24;
export const CODE_LENGTH = 4;

export const ERROR_KEYS = [
  'invalidInput',
  'notFound',
  'tooFewPlayers',
  'tooManyPlayers',
  'nameTooLong',
  'emptyName',
  'duplicateName',
  'reservedName',
  'alreadyTaken',
  'alreadyClaimed',
  'notClaimed',
  'alreadyDead',
  'alreadyWon',
  'gameOver',
  'busy',
  'unknown',
] as const;

export type ErrorKey = (typeof ERROR_KEYS)[number];

export function normalizeCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, CODE_LENGTH);
}

export function isValidCode(code: string): boolean {
  return /^[A-Z]{4}$/.test(code);
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function nameKey(name: string): string {
  return normalizeName(name).toLowerCase();
}

// These names would collide with the static routes under /murderi/game/<code>/.
const RESERVED_NAMES = new Set(['share', 'resume']);

export function isReservedName(name: string): boolean {
  return RESERVED_NAMES.has(nameKey(name));
}

export function gamePath(gameId: string): string {
  return `/murderi/game/${gameId}`;
}

export function playerPath(gameId: string, name: string): string {
  return `${gamePath(gameId)}/${encodeURIComponent(name)}`;
}
