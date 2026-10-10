import type { DrinkTaskKind } from '@/types/task';

export type GamePhase = 'players' | 'categories' | 'playing' | 'end';

// The German category names as stored in the DB.
export type CategoryKey = 'Normal' | 'Party' | 'Duell' | 'Wahrheit' | 'Chaos' | 'Wild' | 'Sexual';

export type DrinkCategory = {
  id: string;
  key: CategoryKey;
  // How many tasks need how many players, so the setup can count what a group can play.
  slotCounts: { slots: number; count: number }[];
};

export type DrinkTask = {
  categoryId: string;
  content: string;
  contentEn: string | null;
  kind: DrinkTaskKind;
  rounds: number | null;
  seconds: number | null;
  endContent: string | null;
  endContentEn: string | null;
};

export type CardKind = DrinkTaskKind | 'ruleEnd' | 'curseEnd';

export type DeckCard = {
  kind: CardKind;
  content: string;
  contentEn: string | null;
  // Drawn once per card, so German and English name the same people. End cards reuse them.
  names: string[];
  sips: number;
  rounds: number | null;
  seconds: number | null;
  // End cards without their own end text repeat the rule text.
  repeatsRule: boolean;
};

export type LoadError = 'failed' | 'empty';

export type StartError = 'loadFailed' | 'offline' | 'noTasks';
