'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { ready, skipStep } from '../actions';
import { NIGHT } from '../palette';
import { RoleDetails } from './my-role';
import { useRoom } from './room-context';
import {
  ActionError,
  GameScreen,
  HostSkip,
  primaryButtonClass,
  textButtonClass,
  tileSurface,
} from './ui';

export function RevealScreen() {
  const { game, view, t, run, busy, gameId } = useRoom();
  const [shown, setShown] = useState(false);
  const me = game?.me;
  const reveal = game?.reveal;
  if (!game || !me || !reveal) return null;

  const waitingFor = view.players
    .filter((p) => p.alive && !reveal.readyIds.includes(p.id))
    .map((p) => p.name);

  return (
    <GameScreen
      color={NIGHT}
      title={t.revealTitle}
      intro={t.revealHint}
      footer={
        <>
          <ActionError />
          {reveal.meReady ? (
            <p className="text-center text-base text-(--muted) md:text-lg" aria-live="polite">
              {waitingFor.length > 0 ? t.waitingFor(waitingFor.join(', ')) : t.waitingForOthers}
            </p>
          ) : (
            <button
              type="button"
              className={primaryButtonClass}
              disabled={busy}
              onClick={() => {
                setShown(false);
                run(() => ready(gameId));
              }}
            >
              {t.ready}
            </button>
          )}
          <HostSkip onSkip={() => run(() => skipStep(gameId))} />
        </>
      }
    >
      {shown ? (
        <div
          className={cn(
            'flex min-h-72 flex-col gap-8 rounded-xl p-6 md:min-h-96 md:p-12',
            tileSurface,
          )}
          onClick={() => setShown(false)}
        >
          <RoleDetails me={me} large />
          <button
            type="button"
            className={cn(textButtonClass, '-ml-2 self-start')}
            onClick={() => setShown(false)}
          >
            {t.tapToHide}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShown(true)}
          className={cn(
            'flex min-h-72 w-full items-center justify-center rounded-xl p-6 text-center text-2xl font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fg) md:min-h-96 md:p-12 md:text-4xl',
            tileSurface,
          )}
        >
          {t.tapToReveal}
        </button>
      )}
    </GameScreen>
  );
}
