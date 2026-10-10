import { useSyncExternalStore } from 'react';

export type Locale = 'de' | 'en';

export const LOCALES: readonly Locale[] = ['de', 'en'];

function isLocale(value: unknown): value is Locale {
  return value === 'de' || value === 'en';
}

export function createLocaleStore(storageKey: string) {
  const listeners = new Set<() => void>();
  // Fallback for browsers where localStorage throws (e.g. private mode).
  let chosen: Locale | null = null;

  function readLocale(): Locale {
    if (chosen) return chosen;
    try {
      const stored = localStorage.getItem(storageKey);
      if (isLocale(stored)) return stored;
    } catch {}
    return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  function subscribe(onChange: () => void) {
    listeners.add(onChange);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) onChange();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener('storage', onStorage);
    };
  }

  function setLocale(locale: Locale) {
    try {
      localStorage.setItem(storageKey, locale);
      chosen = null;
    } catch {
      chosen = locale;
    }
    listeners.forEach((listener) => listener());
  }

  // The server snapshot is 'de', so hydration matches and the client locale applies right after.
  function useLocale(): Locale {
    return useSyncExternalStore(subscribe, readLocale, () => 'de');
  }

  return { useLocale, setLocale };
}
