'use client';

import { useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import { dimmed, type GameColor } from '@/components/game/palette';

import { useWouldYouRatherGame } from '../game-provider';
import { questionColors } from '../palette';
import { Choice } from '../types';

// Sizes use the half's own width (cqi) and --unit, which is 1dvh while the halves are stacked
// and 2dvh once they sit side by side in landscape and each gets the full height.
function optionFontSize(length: number, scale = 1) {
  let size: string;
  if (length <= 40) size = 'clamp(1.75rem, min(9cqi, var(--unit) * 5.5), 4.5rem)';
  else if (length <= 80) size = 'clamp(1.5rem, min(7.5cqi, var(--unit) * 4.5), 3.75rem)';
  else if (length <= 120) size = 'clamp(1.25rem, min(6.5cqi, var(--unit) * 3.75), 3rem)';
  else size = 'clamp(1.125rem, min(5.5cqi, var(--unit) * 3.25), 2.5rem)';
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
    backToSetup,
    locale,
    t,
  } = useWouldYouRatherGame();
  const topRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const revealed = choice !== null && votes !== null;
  const colors = questionColors(currentIndex);
  const guarded = useTapGuard(`${currentIndex}-${revealed}`, {
    focusRef: revealed ? nextRef : topRef,
  });

  if (currentOptions === null) return null;

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
    <GameShell
      color={{ bg: '#000000', fg: topColor.fg }}
      themeColor={colors.top.bg}
      lang={locale}
      labels={t}
      onQuit={backToSetup}
      className="flex flex-col [--unit:1dvh] landscape:flex-row landscape:[--unit:2dvh]"
    >
      <Half
        {...halfProps('a')}
        buttonRef={topRef}
        className="pt-[calc(env(safe-area-inset-top)+4rem)] pb-6 landscape:pr-0 landscape:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      />
      <div className="relative z-[1] h-0.5 shrink-0 bg-black landscape:h-auto landscape:w-0.5">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase">
          {t.or}
        </span>
      </div>
      <Half
        {...halfProps('b')}
        className="pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] landscape:pt-[calc(env(safe-area-inset-top)+4rem)] landscape:pl-0"
      />

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
    </GameShell>
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
  color: GameColor;
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
    <span className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-2 px-6 text-center lg:max-w-4xl">
      {result && (
        <span
          className="block leading-none font-bold tracking-tight tabular-nums"
          style={{
            fontSize: result.chosen
              ? 'clamp(3rem, min(20cqi, var(--unit) * 11), 8rem)'
              : 'clamp(2rem, min(12cqi, var(--unit) * 7), 5rem)',
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
        <span className="block text-sm font-medium tabular-nums md:text-base">
          {result.chosen && <span className="sr-only">{yourChoice}: </span>}
          {result.votesLabel}
        </span>
      )}
    </span>
  );

  const baseClass = `@container flex min-h-0 min-w-0 w-full flex-1 overflow-hidden pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] transition-colors duration-150 motion-reduce:transition-none ${className}`;
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
