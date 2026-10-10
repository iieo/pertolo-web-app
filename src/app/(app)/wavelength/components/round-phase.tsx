'use client';

import { useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import { cn } from '@/lib/utils';

import { useWavelengthGame } from '../game-provider';
import { roundColor } from '../palette';
import { Dial, SpectrumLabels } from './dial';

const overlayClass =
  'absolute inset-0 z-10 block h-full w-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current';

const actionClass =
  'flex min-h-14 w-full items-center justify-center rounded-xl px-6 text-lg font-bold outline-none transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none motion-reduce:active:scale-100 md:max-w-sm md:text-xl';

export function RoundPhase() {
  const {
    phase,
    currentIndex,
    currentRound,
    left,
    right,
    teamCount,
    targetVisible,
    showTarget,
    hideTarget,
    needle,
    setNeedle,
    reveal,
    lastPoints,
    scores,
    isLastRound,
    nextRound,
    backToSetup,
    locale,
    t,
  } = useWavelengthGame();
  const showRef = useRef<HTMLButtonElement>(null);
  const hideRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const focusRef =
    phase === 'clue'
      ? targetVisible
        ? hideRef
        : showRef
      : phase === 'guess'
        ? sliderRef
        : nextRef;
  const guarded = useTapGuard(`${currentIndex}-${phase}-${targetVisible}`, { focusRef });

  if (!currentRound) return null;

  const color = roundColor(currentIndex);
  const target = currentRound.target;
  const showBands = (phase === 'clue' && targetVisible) || phase === 'reveal';
  // The clue screen keeps the Hide button's space while the target is hidden, so nothing jumps.
  const action =
    phase === 'clue'
      ? { label: t.hide, onClick: hideTarget, hidden: !targetVisible }
      : phase === 'guess'
        ? { label: t.reveal, onClick: reveal, hidden: false }
        : null;

  return (
    <GameShell color={color} lang={locale} labels={t} onQuit={backToSetup}>
      <div className="flex h-full flex-col pt-[calc(env(safe-area-inset-top)+4rem)] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] md:pr-[max(3rem,env(safe-area-inset-right))] md:pl-[max(3rem,env(safe-area-inset-left))]">
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center gap-6 md:gap-12">
          {teamCount === 2 && (
            <p className="text-lg font-semibold md:text-2xl">{t.teamName(currentRound.team)}</p>
          )}

          <SpectrumLabels left={left} right={right} />

          <Dial
            bg={color.bg}
            target={showBands ? target : undefined}
            targetLabel={t.target(Math.round(target))}
            needle={phase === 'clue' ? undefined : needle}
            slider={
              phase === 'guess'
                ? {
                    onChange: setNeedle,
                    label: t.needle,
                    valueText: t.needleValue(Math.round(needle), left, right),
                  }
                : undefined
            }
            sliderRef={sliderRef}
          />

          {phase === 'reveal' && (
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
              <p className="flex items-baseline gap-4">
                <span
                  className="leading-none font-bold tracking-tight tabular-nums"
                  style={{ fontSize: 'clamp(3rem, min(22vw, 16dvh), 9rem)' }}
                >
                  {lastPoints}
                </span>
                <span className="text-xl font-semibold md:text-3xl">{t.points(lastPoints)}</span>
              </p>
              <dl aria-label={t.scoresLabel} className="flex gap-8 md:gap-12">
                {(teamCount === 1 ? [t.total] : [t.teamName(0), t.teamName(1)]).map(
                  (label, index) => (
                    <div key={label} className="flex flex-col gap-1">
                      <dt className="text-base font-medium md:text-lg">{label}</dt>
                      <dd className="text-3xl leading-none font-bold tabular-nums md:text-5xl">
                        {scores[index]}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            </div>
          )}
        </div>

        {action && (
          <div className="mx-auto flex w-full max-w-5xl justify-center pt-6">
            <button
              ref={phase === 'clue' ? hideRef : undefined}
              type="button"
              onClick={guarded(action.onClick)}
              className={cn(actionClass, action.hidden && 'invisible')}
              style={{ backgroundColor: color.fg, color: color.bg }}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {phase === 'clue' && !targetVisible && (
        <button
          ref={showRef}
          type="button"
          aria-label={t.showTarget}
          onClick={guarded(showTarget)}
          className={overlayClass}
        />
      )}

      {phase === 'reveal' && (
        <button
          ref={nextRef}
          type="button"
          aria-label={isLastRound ? t.lastRoundHint : t.nextRoundHint}
          onClick={guarded(nextRound)}
          className={overlayClass}
        />
      )}

      <p className="sr-only" aria-live="polite">
        {phase === 'reveal' ? `${lastPoints} ${t.points(lastPoints)}` : ''}
      </p>
    </GameShell>
  );
}
