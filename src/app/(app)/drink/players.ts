import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'drink-players';

export const MIN_PLAYERS = 2;
export const MAX_NAME_LENGTH = 20;

const listeners = new Set<() => void>();
// The snapshot must keep its identity between reads, otherwise useSyncExternalStore loops.
let cache: string[] | null = null;

function readPlayers(): string[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    cache = Array.isArray(parsed)
      ? parsed.filter((name): name is string => typeof name === 'string' && name.trim() !== '')
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function setPlayers(update: (players: string[]) => string[]) {
  cache = update(readPlayers());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((listener) => listener());
}

export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}

export function isSameName(a: string, b: string) {
  return a.localeCompare(b, 'de', { sensitivity: 'accent' }) === 0;
}

// Null until the client has read localStorage, so pages can tell "loading" from "no players".
export function usePlayers(): string[] | null {
  return useSyncExternalStore(subscribe, readPlayers, () => null);
}
