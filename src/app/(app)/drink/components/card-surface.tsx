'use client';

import { Fragment, useEffect, useMemo, useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import type { GameColor } from '@/components/game/palette';
import { cn } from '@/lib/utils';

import { useDrinkGame } from '../game-provider';
import type { Segment } from '../template';

/**
 * Full-bleed card. The whole surface is one tap target that advances, guarded against double
 * taps. `background` paints behind the tap target, `announce` is read out by screen readers.
 */
export function CardSurface({
  color,
  themeColor,
  label,
  background,
  announce,
  className,
  children,
}: {
  color: GameColor;
  themeColor?: string;
  /** Plain text of the card for the tap target's aria-label. */
  label: string;
  background?: React.ReactNode;
  announce?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { currentIndex, isLastTask, nextTask, backToSetup, locale, t } = useDrinkGame();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const guard = useTapGuard(currentIndex, { focusRef: buttonRef });
  const advance = useMemo(() => guard(nextTask), [guard, nextTask]);

  // Enter and Space reach the focused tap button natively. ArrowRight works from anywhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
      if (document.querySelector('[role="dialog"]')) return;
      e.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advance]);

  return (
    <GameShell
      color={color}
      themeColor={themeColor}
      lang={locale}
      labels={t}
      onQuit={backToSetup}
      className="transition-colors duration-300 motion-reduce:transition-none"
    >
      {background}
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${label} ${isLastTask ? t.lastTaskHint : t.nextTaskHint}`}
        onClick={advance}
        className="absolute inset-0 z-10 block h-full w-full cursor-pointer text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
      >
        <span
          className={cn(
            'relative mx-auto flex h-full w-full max-w-3xl flex-col justify-center gap-6 pt-[calc(env(safe-area-inset-top)+4rem)] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] md:gap-8 md:px-12',
            className,
          )}
        >
          {children}
        </span>
      </button>
      {announce !== undefined && (
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      )}
    </GameShell>
  );
}

/** The kind label: plain text, small and spaced, never a chip. */
export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'block text-base font-semibold tracking-[0.12em] uppercase md:text-lg',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Body text where names and sip counts stand out through weight alone. */
export function RichText({
  segments,
  size,
  className,
}: {
  segments: readonly Segment[];
  size: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'block font-semibold tracking-tight text-pretty wrap-break-word hyphens-auto',
        className,
      )}
      style={{ fontSize: size, lineHeight: 1.15 }}
    >
      {segments.map((segment, i) =>
        segment.type === 'text' ? (
          <Fragment key={i}>{segment.value}</Fragment>
        ) : (
          <span key={i} className="font-black tabular-nums hyphens-none">
            {segment.value}
          </span>
        ),
      )}
    </span>
  );
}

const BODY_STEPS: [maxLength: number, minRem: number, vw: number, dvh: number, maxRem: number][] = [
  [40, 2.25, 11, 7, 4.5],
  [80, 1.875, 8.5, 5.5, 3.5],
  [120, 1.5, 7.5, 4.75, 3],
  [180, 1.375, 6.5, 4, 2.5],
  [Infinity, 1.25, 5.75, 3.5, 2.25],
];

/** Fluid size by text length. `scale` below 1 leaves room for a hero element on the card. */
export function bodySize(length: number, scale = 1) {
  const [, min, vw, dvh, max] = BODY_STEPS.find(([maxLength]) => length <= maxLength)!;
  const s = (n: number) => +(n * scale).toFixed(3);
  return `clamp(${s(min)}rem, min(${s(vw)}vw, ${s(dvh)}dvh), ${s(max)}rem)`;
}

export function nameSize(length: number) {
  if (length <= 8) return 'clamp(3rem, min(18vw, 12dvh), 8rem)';
  if (length <= 14) return 'clamp(2.5rem, min(12vw, 9dvh), 6rem)';
  return 'clamp(2rem, min(9vw, 7dvh), 4.5rem)';
}

export const heroClass =
  'block font-black tracking-tighter text-balance wrap-break-word hyphens-none leading-[0.9]';
