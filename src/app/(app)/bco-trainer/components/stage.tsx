'use client';

import type { GameColor } from '@/components/game/palette';

type Action = { label: string; onClick: () => void };

/** Padded column below the Quit button: content on top, the controls pinned to the bottom. */
export function Stage({
  controls,
  children,
}: {
  controls: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4 pt-[calc(env(safe-area-inset-top)+4rem)] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))]">
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      {controls}
    </div>
  );
}

/** Beat number in a fixed-height slot above the content, so nothing moves or hides while counting in. */
export function CountIn({ beat }: { beat: number | null }) {
  return (
    <p
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none flex h-16 shrink-0 items-center justify-center text-6xl leading-none font-bold tabular-nums"
    >
      {beat ?? ''}
    </p>
  );
}

/** One large primary action and at most one secondary text button. */
export function Controls({
  color,
  primary,
  secondary,
  primaryRef,
}: {
  color: GameColor;
  primary?: Action;
  secondary?: Action;
  primaryRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md shrink-0 flex-col gap-2">
      {primary && (
        <button
          ref={primaryRef}
          type="button"
          onClick={primary.onClick}
          className="flex min-h-14 w-full items-center justify-center rounded-xl px-6 text-lg font-bold outline-none transition-transform duration-150 focus-visible:outline-3 focus-visible:outline-offset-3 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
          style={{ backgroundColor: color.fg, color: color.bg, outlineColor: color.fg }}
        >
          {primary.label}
        </button>
      )}
      {secondary && (
        <button
          type="button"
          onClick={secondary.onClick}
          className="flex min-h-12 w-full items-center justify-center rounded-xl px-6 text-base font-semibold underline decoration-current/40 underline-offset-4 outline-none hover:decoration-current focus-visible:outline-2 focus-visible:outline-current"
        >
          {secondary.label}
        </button>
      )}
    </div>
  );
}
