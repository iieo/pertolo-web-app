import { useSyncExternalStore } from 'react';

import { LEVELS, type Level } from './rhythm';

export type Mode = 'listen' | 'read' | 'quiz';
export const MODES: readonly Mode[] = ['listen', 'read', 'quiz'];

export type Tempo = 60 | 80 | 100 | 120;
export const TEMPOS: readonly Tempo[] = [60, 80, 100, 120];

export type Measures = 1 | 2 | 4;
export const MEASURE_OPTIONS: readonly Measures[] = [1, 2, 4];
export const QUIZ_MEASURE_OPTIONS: readonly Measures[] = [1, 2];

export const QUIZ_ROUNDS = 10;

export type Settings = {
  mode: Mode;
  level: Level;
  tempo: Tempo;
  measures: Measures;
  metronome: boolean;
};

const STORAGE_KEY = 'bco-trainer-settings';

const DEFAULT_SETTINGS: Settings = {
  mode: 'listen',
  level: 1,
  tempo: 80,
  measures: 2,
  metronome: true,
};

function pick<T>(options: readonly T[], value: unknown, fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

function parse(raw: string | null): Settings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const data = JSON.parse(raw) as Partial<Record<keyof Settings, unknown>> | null;
    if (!data || typeof data !== 'object') return DEFAULT_SETTINGS;
    return {
      mode: pick(MODES, data.mode, DEFAULT_SETTINGS.mode),
      level: pick(LEVELS, data.level, DEFAULT_SETTINGS.level),
      tempo: pick(TEMPOS, data.tempo, DEFAULT_SETTINGS.tempo),
      measures: pick(MEASURE_OPTIONS, data.measures, DEFAULT_SETTINGS.measures),
      metronome: typeof data.metronome === 'boolean' ? data.metronome : DEFAULT_SETTINGS.metronome,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const listeners = new Set<() => void>();
// The snapshot must keep its identity between reads, otherwise useSyncExternalStore loops.
let cache: Settings | null = null;

function readSettings(): Settings {
  if (cache) return cache;
  try {
    cache = parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    cache = DEFAULT_SETTINGS;
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

export function updateSettings(patch: Partial<Settings>) {
  cache = { ...readSettings(), ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((listener) => listener());
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, readSettings, () => DEFAULT_SETTINGS);
}

// The stored value is kept, so switching back from Quiz restores 4 measures.
export function effectiveMeasures({ mode, measures }: Settings): Measures {
  return mode === 'quiz' && !QUIZ_MEASURE_OPTIONS.includes(measures) ? 2 : measures;
}
