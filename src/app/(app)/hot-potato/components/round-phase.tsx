'use client';

import { useEffect, useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import { cn } from '@/lib/utils';

import { randomFuseMs } from '../categories';
import { useHotPotatoGame } from '../game-provider';
import { BOOM_COLOR, promptColor } from '../palette';

const TAP_LOCK_MS = 300;
// Longer lock after the explosion, so a tap that was meant for the ticking screen is ignored.
const BOOM_TAP_LOCK_MS = 1000;
const SLOWEST_TICK_MS = 1000;
const FASTEST_TICK_MS = 150;
// Keeps the brightening below three flashes per second once the ticks speed up.
const MIN_PULSE_GAP_MS = 340;
const BOOM_VIBRATION = [400, 100, 200, 100, 600];

function tickInterval(progress: number) {
  return SLOWEST_TICK_MS - (SLOWEST_TICK_MS - FASTEST_TICK_MS) * progress ** 1.5;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function promptFontSize(length: number) {
  if (length <= 30) return 'clamp(2.5rem, min(11vw, 9dvh), 7rem)';
  if (length <= 60) return 'clamp(2rem, min(9vw, 7.5dvh), 5.5rem)';
  return 'clamp(1.75rem, min(7.5vw, 6dvh), 4.25rem)';
}

export function RoundPhase() {
  const {
    phase,
    currentPrompt,
    currentIndex,
    isLastPrompt,
    fuseLength,
    soundOn,
    audio,
    lightFuse,
    explode,
    nextPrompt,
    backToSetup,
    locale,
    t,
  } = useHotPotatoGame();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const boomTextRef = useRef<HTMLParagraphElement>(null);
  const tapRef = useRef<HTMLButtonElement>(null);
  const boom = phase === 'boom';
  const color = boom ? BOOM_COLOR : promptColor(currentIndex);
  const guarded = useTapGuard(`${phase}-${currentIndex}`, {
    focusRef: tapRef,
    lockMs: boom ? BOOM_TAP_LOCK_MS : TAP_LOCK_MS,
    enabled: phase !== 'ticking',
  });

  useEffect(() => {
    if (phase !== 'ticking') return;

    const duration = randomFuseMs(fuseLength);
    const start = performance.now();
    const reduced = prefersReducedMotion();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ticks = 0;
    let lastPulse = -Infinity;
    let wakeLock: WakeLockSentinel | null = null;
    let cancelled = false;

    try {
      if ('wakeLock' in navigator) {
        navigator.wakeLock
          .request('screen')
          .then((lock) => {
            if (cancelled) lock.release().catch(() => {});
            else wakeLock = lock;
          })
          .catch(() => {});
      }
    } catch {}

    const step = () => {
      const now = performance.now();
      const elapsed = now - start;
      if (elapsed >= duration) {
        if (soundOn) audio.explode();
        try {
          if ('vibrate' in navigator) navigator.vibrate(BOOM_VIBRATION);
        } catch {}
        explode();
        return;
      }
      ticks += 1;
      if (soundOn) audio.tick(ticks % 2 === 1);
      if (!reduced && now - lastPulse >= MIN_PULSE_GAP_MS) {
        lastPulse = now;
        pulseRef.current?.animate([{ opacity: 0.18 }, { opacity: 0 }], {
          duration: 200,
          easing: 'ease-out',
        });
      }
      timer = setTimeout(step, Math.min(tickInterval(elapsed / duration), duration - elapsed));
    };
    step();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      wakeLock?.release().catch(() => {});
    };
  }, [phase, fuseLength, soundOn, audio, explode]);

  useEffect(() => {
    if (phase !== 'boom' || prefersReducedMotion()) return;
    surfaceRef.current?.animate(
      [{ backgroundColor: '#FFFFFF' }, { backgroundColor: BOOM_COLOR.bg }],
      { duration: 500, easing: 'ease-out' },
    );
    boomTextRef.current?.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], {
      duration: 500,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    });
  }, [phase]);

  if (currentPrompt === null) return null;

  const tapLabel = boom
    ? isLastPrompt
      ? t.lastPromptHint
      : t.nextPromptHint
    : t.lightFuse(currentPrompt);

  return (
    <GameShell
      color={color}
      lang={locale}
      labels={t}
      onQuit={backToSetup}
      className="flex flex-col"
      surfaceRef={surfaceRef}
    >
      <div
        ref={pulseRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white opacity-0"
      />

      {boom ? (
        <div className="flex flex-1 items-center justify-center pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))]">
          <p
            ref={boomTextRef}
            className="leading-none font-bold tracking-tight"
            style={{ fontSize: 'clamp(5rem, min(30vw, 20dvh), 12rem)' }}
          >
            {t.boom}
          </p>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col pt-[calc(env(safe-area-inset-top)+4rem)] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] lg:max-w-4xl">
          <div className="flex min-h-0 flex-1 items-center justify-center text-center">
            <p
              className="font-bold tracking-tight text-balance wrap-break-word hyphens-auto"
              style={{ fontSize: promptFontSize(currentPrompt.length), lineHeight: 1.1 }}
            >
              {currentPrompt}
            </p>
          </div>
          <p
            aria-hidden
            className={cn(
              'text-center text-sm font-medium md:text-base',
              phase === 'ticking' && 'invisible',
            )}
          >
            {t.tapToStart}
          </p>
        </div>
      )}

      {phase !== 'ticking' && (
        <button
          ref={tapRef}
          type="button"
          aria-label={tapLabel}
          onClick={guarded(boom ? nextPrompt : lightFuse)}
          className="absolute inset-0 z-10 block h-full w-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
        />
      )}

      <p className="sr-only" aria-live="assertive">
        {phase === 'ticking' ? t.ticking : boom ? t.boomAnnouncement : ''}
      </p>
    </GameShell>
  );
}
