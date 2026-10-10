import { useSyncExternalStore } from 'react';

import { Locale } from './i18n';

const STORAGE_KEY = 'wyr-locale';

const listeners = new Set<() => void>();
// Fallback for browsers where localStorage throws (e.g. private mode).
let chosen: Locale | null = null;

function isLocale(value: unknown): value is Locale {
  return value === 'de' || value === 'en';
}

function readLocale(): Locale {
  if (chosen) return chosen;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {}
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function setLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
    chosen = null;
  } catch {
    chosen = locale;
  }
  listeners.forEach((listener) => listener());
}

// The server snapshot is 'de', so hydration matches and the client locale applies right after.
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, readLocale, () => 'de');
}
