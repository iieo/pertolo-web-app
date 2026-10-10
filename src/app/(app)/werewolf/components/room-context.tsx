'use client';

import { createContext, useContext } from 'react';

import type { Result } from '@/util/types';

import type { Dictionary, Locale } from '../i18n';
import type { GameView, JoinedView, ViewPlayer } from '../lib/view';
import type { Narration } from './use-narration';

export interface RoomContextValue {
  gameId: string;
  view: JoinedView;
  game: GameView | null;
  t: Dictionary;
  locale: Locale;
  /** serverNow - Date.now() of the last accepted poll. */
  clockOffset: number;
  busy: boolean;
  error: string | null;
  run: (fn: () => Promise<Result<unknown>>) => Promise<boolean>;
  /** Resolves after a poll that started after this call. */
  refresh: () => Promise<void>;
  player: (id: string | null | undefined) => ViewPlayer | undefined;
  name: (id: string | null | undefined) => string;
  quit: () => Promise<void>;
  /** Host-only spoken narration. */
  narration: Narration;
}

export const RoomContext = createContext<RoomContextValue | null>(null);

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom must be used inside RoomContext');
  return ctx;
}
