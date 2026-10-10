'use client';

import { useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import { cn } from '@/lib/utils';

import { useHotTakesGame } from '../game-provider';
import { ANSWER_COLORS, statementColor } from '../palette';
import { Choice, Votes } from '../types';

const CHOICES: Choice[] = ['agree', 'disagree'];

// Sizes use the panel's own width (cqi) and --unit, which is 1dvh while the panels are stacked
// and 1.5dvh once they sit side by side in landscape and each gets the full height.
function statementFontSize(length: number) {
  if (length <= 60) return 'clamp(1.75rem, min(9cqi, var(--unit) * 5.5), 4.5rem)';
  if (length <= 110) return 'clamp(1.5rem, min(7.5cqi, var(--unit) * 4.5), 3.75rem)';
  if (length <= 160) return 'clamp(1.25rem, min(6.5cqi, var(--unit) * 3.75), 3rem)';
  return 'clamp(1.125rem, min(5.5cqi, var(--unit) * 3.25), 2.5rem)';
}

function percentages({ votesAgree, votesDisagree }: Votes) {
  const total = votesAgree + votesDisagree;
  const agree = total === 0 ? 50 : Math.round((votesAgree * 100) / total);
  return { agree, disagree: 100 - agree };
}

export function QuestionPhase() {
  const {
    currentStatement,
    currentIndex,
    choice,
    votes,
    choose,
    isLastTake,
    nextTake,
    backToSetup,
    locale,
    t,
  } = useHotTakesGame();
  const agreeRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const revealed = choice !== null && votes !== null;
  const color = statementColor(currentIndex);
  const guarded = useTapGuard(`${currentIndex}-${revealed}`, {
    focusRef: revealed ? nextRef : agreeRef,
  });

  if (currentStatement === null) return null;

  const percent = revealed ? percentages(votes) : null;
  const numberFormat = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US');

  return (
    <GameShell
      color={{ bg: '#000000', fg: color.fg }}
      themeColor={color.bg}
      lang={locale}
      labels={t}
      onQuit={backToSetup}
      className="flex flex-col [--unit:1dvh] landscape:flex-row landscape:[--unit:1.5dvh]"
    >
      <div
        className="@container flex min-h-0 w-full min-w-0 flex-[3] overflow-hidden pt-[calc(env(safe-area-inset-top)+4rem)] pr-[env(safe-area-inset-right)] pb-6 pl-[env(safe-area-inset-left)] landscape:pr-0 landscape:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{ backgroundColor: color.bg, color: color.fg }}
      >
        <p
          className="mx-auto flex h-full w-full max-w-2xl items-center justify-center px-6 text-center font-bold lg:max-w-4xl tracking-tight text-pretty wrap-break-word hyphens-auto"
          style={{ fontSize: statementFontSize(currentStatement.length), lineHeight: 1.15 }}
        >
          {currentStatement}
        </p>
      </div>

      <div className="h-0.5 shrink-0 bg-black landscape:h-auto landscape:w-0.5" />

      {revealed && percent ? (
        <div
          className="@container flex min-h-0 w-full min-w-0 flex-[2] overflow-hidden pt-6 pr-[env(safe-area-inset-right)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[env(safe-area-inset-left)] landscape:pt-[calc(env(safe-area-inset-top)+1.5rem)] landscape:pl-0"
          style={{ backgroundColor: ANSWER_COLORS[choice].bg, color: ANSWER_COLORS[choice].fg }}
        >
          <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center gap-4 px-6 md:gap-6">
            <p className="flex flex-col gap-1">
              <span className="sr-only">{t.yourChoice}: </span>
              <span
                className="block leading-none font-bold tracking-tight tabular-nums"
                style={{ fontSize: 'clamp(3rem, min(20cqi, var(--unit) * 10), 8rem)' }}
              >
                {percent[choice]}%
              </span>
              <span className="block text-lg font-semibold md:text-2xl">
                {t.shareLabel[choice]}
              </span>
            </p>
            <div className="flex flex-col gap-2">
              <div
                role="img"
                aria-label={t.resultBarLabel(percent.agree, percent.disagree)}
                className="flex h-4 w-full overflow-hidden bg-black"
              >
                <div
                  className="h-full bg-white transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${percent.agree}%` }}
                />
              </div>
              <div className="flex justify-between gap-4 text-sm font-medium tabular-nums md:text-base">
                <span>
                  {t.answers.agree} {percent.agree}%
                </span>
                <span className="text-right">
                  {t.answers.disagree} {percent.disagree}%
                </span>
              </div>
            </div>
            <p className="text-sm tabular-nums md:text-base">
              {t.votes(
                numberFormat.format(votes.votesAgree + votes.votesDisagree),
                votes.votesAgree + votes.votesDisagree,
              )}
            </p>
          </div>
        </div>
      ) : (
        <div
          role="group"
          aria-label={t.answersLabel}
          className="grid min-h-0 w-full min-w-0 flex-[2] grid-cols-2 gap-0.5 bg-black landscape:grid-cols-1 landscape:grid-rows-2"
        >
          {CHOICES.map((side) => (
            <button
              key={side}
              ref={side === 'agree' ? agreeRef : undefined}
              type="button"
              onClick={guarded(() => choose(side))}
              className={cn(
                'flex h-full min-h-0 min-w-0 cursor-pointer items-center justify-center px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center font-bold tracking-tight text-balance wrap-break-word hyphens-auto outline-none transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current landscape:pr-[max(1rem,env(safe-area-inset-right))]',
                side === 'agree'
                  ? 'pl-[max(1rem,env(safe-area-inset-left))] landscape:pb-4 landscape:pl-4'
                  : 'pr-[max(1rem,env(safe-area-inset-right))]',
              )}
              style={{
                backgroundColor: ANSWER_COLORS[side].bg,
                color: ANSWER_COLORS[side].fg,
                fontSize: 'clamp(1.5rem, min(7vw, var(--unit) * 4), 3.5rem)',
                lineHeight: 1.15,
              }}
            >
              {t.answers[side]}
            </button>
          ))}
        </div>
      )}

      {revealed && (
        <button
          ref={nextRef}
          type="button"
          aria-label={isLastTake ? t.lastTakeHint : t.nextTakeHint}
          onClick={guarded(nextTake)}
          className="absolute inset-0 z-10 block h-full w-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-white"
        />
      )}

      <p className="sr-only" aria-live="polite">
        {percent ? t.resultsAnnouncement(percent.agree, percent.disagree) : ''}
      </p>
    </GameShell>
  );
}
