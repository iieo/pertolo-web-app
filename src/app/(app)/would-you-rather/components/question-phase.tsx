'use client';

import { useEffect, useRef } from 'react';

import { useWouldYouRatherGame } from '../game-provider';
import { type Color, dimmed, questionColors } from '../palette';
import { Choice } from '../types';
import { GameHeader } from './game-shell';

const TAP_LOCK_MS = 300;

function optionFontSize(length: number, scale = 1) {
  let size: string;
  if (length <= 40) size = 'clamp(1.75rem, min(9vw, 5.5dvh), 3.5rem)';
  else if (length <= 80) size = 'clamp(1.5rem, min(7.5vw, 4.5dvh), 3rem)';
  else if (length <= 120) size = 'clamp(1.25rem, min(6.5vw, 3.75dvh), 2.5rem)';
  else size = 'clamp(1.125rem, min(5.5vw, 3.25dvh), 2.125rem)';
  return scale === 1 ? size : `calc(${size} * ${scale})`;
}

function percentages(votesA: number, votesB: number) {
  const total = votesA + votesB;
  const a = total === 0 ? 50 : Math.round((votesA * 100) / total);
  return { a, b: 100 - a };
}

export function QuestionPhase() {
  const {
    currentOptions,
    currentIndex,
    choice,
    votes,
    choose,
    isLastQuestion,
    nextQuestion,
    locale,
    t,
  } = useWouldYouRatherGame();
  const topRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const lockedUntil = useRef(Infinity);
  const revealed = choice !== null && votes !== null;
  const colors = questionColors(currentIndex);

  useEffect(() => {
    lockedUntil.current = performance.now() + TAP_LOCK_MS;
    (revealed ? nextRef : topRef).current?.focus({ preventScroll: true });
  }, [currentIndex, revealed]);

  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevOverscroll = html.style.overscrollBehavior;
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    return () => {
      html.style.overflow = prevOverflow;
      html.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const prev = meta.content;
    meta.content = colors.top.bg;
    return () => {
      meta.content = prev;
    };
  }, [colors.top.bg]);

  if (currentOptions === null) return null;

  const guarded = (action: () => void) => () => {
    if (performance.now() < lockedUntil.current) return;
    lockedUntil.current = Infinity;
    action();
  };

  const percent = revealed ? percentages(votes.votesA, votes.votesB) : null;
  const numberFormat = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US');
  const topColor = revealed && choice !== 'a' ? dimmed(colors.top) : colors.top;

  const halfProps = (side: Choice) => {
    const isA = side === 'a';
    const count = votes ? (isA ? votes.votesA : votes.votesB) : 0;
    return {
      text: isA ? currentOptions.a : currentOptions.b,
      color: isA ? colors.top : colors.bottom,
      result:
        revealed && percent
          ? {
              percent: isA ? percent.a : percent.b,
              votesLabel: t.votes(numberFormat.format(count), count),
              chosen: choice === side,
            }
          : null,
      chooseLabel: t.choose(isA ? currentOptions.a : currentOptions.b),
      yourChoice: t.yourChoice,
      onChoose: guarded(() => choose(side)),
    };
  };

  return (
    <div className="fixed inset-0 flex h-dvh flex-col overflow-hidden overscroll-none bg-black select-none touch-manipulation">
      <Half
        {...halfProps('a')}
        buttonRef={topRef}
        className="pt-[calc(env(safe-area-inset-top)+4rem)] pb-6"
      />
      <div className="relative z-[1] h-0.5 shrink-0 bg-black">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase">
          {t.or}
        </span>
      </div>
      <Half {...halfProps('b')} className="pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]" />

      {revealed && (
        <button
          ref={nextRef}
          type="button"
          aria-label={isLastQuestion ? t.lastQuestionHint : t.nextQuestionHint}
          onClick={guarded(nextQuestion)}
          className="absolute inset-0 z-10 block h-full w-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-white"
        />
      )}

      <p className="sr-only" aria-live="polite">
        {percent ? t.resultsAnnouncement(percent.a, percent.b) : ''}
      </p>

      <GameHeader color={topColor.fg} />
    </div>
  );
}

function Half({
  text,
  color,
  result,
  chooseLabel,
  yourChoice,
  onChoose,
  buttonRef,
  className,
}: {
  text: string;
  color: Color;
  result: { percent: number; votesLabel: string; chosen: boolean } | null;
  chooseLabel: string;
  yourChoice: string;
  onChoose: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  className: string;
}) {
  const shown = result && !result.chosen ? dimmed(color) : color;
  const scale = result ? (result.chosen ? 0.75 : 0.6) : 1;

  const content = (
    <span className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-2 px-6 text-center">
      {result && (
        <span
          className="block leading-none font-bold tracking-tight tabular-nums"
          style={{
            fontSize: result.chosen
              ? 'clamp(3rem, min(20vw, 11dvh), 7rem)'
              : 'clamp(2rem, min(12vw, 7dvh), 4.5rem)',
          }}
        >
          {result.percent}%
        </span>
      )}
      <span
        className="block font-bold tracking-tight text-pretty wrap-break-word hyphens-auto"
        style={{ fontSize: optionFontSize(text.length, scale), lineHeight: 1.15 }}
      >
        {text}
      </span>
      {result && (
        <span className="block text-sm font-medium tabular-nums">
          {result.chosen && <span className="sr-only">{yourChoice}: </span>}
          {result.votesLabel}
        </span>
      )}
    </span>
  );

  const baseClass = `flex min-h-0 w-full flex-1 overflow-hidden transition-colors duration-150 motion-reduce:transition-none ${className}`;
  const style = { backgroundColor: shown.bg, color: shown.fg };

  if (result) {
    return (
      <div className={baseClass} style={style}>
        {content}
      </div>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={chooseLabel}
      onClick={onChoose}
      className={`${baseClass} cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current`}
      style={style}
    >
      {content}
    </button>
  );
}
