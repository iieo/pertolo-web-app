'use client';

import { useEffect, useRef, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import type { Locale } from '@/components/game/locale';
import { cn } from '@/lib/utils';

import type { Dictionary } from '../i18n';
import { type RoundColor, roundColor } from '../palette';
import type { Rhythm } from '../rhythm';
import { createQuizRound, type QuizRound } from '../rounds';
import { QUIZ_ROUNDS } from '../settings';
import { usePlayback } from '../use-playback';
import { Notation } from './notation';
import { Controls, CountIn, Stage } from './stage';
import type { GameConfig } from './trainer-phase';

type State = { index: number; round: QuizRound; picked: number | null; score: number };

export function QuizPhase({
  config,
  locale,
  t,
  onQuit,
  onFinish,
}: {
  config: GameConfig;
  locale: Locale;
  t: Dictionary;
  onQuit: () => void;
  onFinish: (score: number, total: number) => void;
}) {
  const [state, setState] = useState<State>(() => ({
    index: 0,
    round: createQuizRound(config.level, config.measures),
    picked: null,
    score: 0,
  }));
  const playback = usePlayback(config);
  const { play, stop } = playback;
  const nextRef = useRef<HTMLButtonElement>(null);
  const guard = useTapGuard(`${state.index}-${state.picked}-${playback.version}`);
  const { round, picked } = state;
  const color = roundColor(state.index);
  const answered = picked !== null;
  const isLast = state.index + 1 >= QUIZ_ROUNDS;

  useEffect(() => {
    play(round.target);
    return stop;
  }, [round.target, play, stop]);

  useEffect(() => {
    if (answered) nextRef.current?.focus({ preventScroll: true });
  }, [answered]);

  const choose = (index: number) => {
    if (answered) return;
    setState((s) =>
      s.picked !== null
        ? s
        : { ...s, picked: index, score: s.score + (index === s.round.correctIndex ? 1 : 0) },
    );
  };

  const next = () => {
    stop();
    if (isLast) {
      onFinish(state.score, QUIZ_ROUNDS);
      return;
    }
    setState((s) => ({
      index: s.index + 1,
      round: createQuizRound(config.level, config.measures, s.round.target),
      picked: null,
      score: s.score,
    }));
  };

  const announcement = !answered
    ? ''
    : picked === round.correctIndex
      ? t.correctAnnouncement
      : t.wrongAnnouncement(round.correctIndex + 1);

  return (
    <GameShell
      color={color}
      lang={locale}
      labels={t}
      onQuit={() => {
        stop();
        onQuit();
      }}
      className="transition-colors duration-150 motion-reduce:transition-none"
    >
      <Stage
        controls={
          <Controls
            color={color}
            primaryRef={nextRef}
            primary={
              answered ? { label: isLast ? t.showScore : t.next, onClick: guard(next) } : undefined
            }
            secondary={{ label: t.again, onClick: guard(() => play(round.target)) }}
          />
        }
      >
        <CountIn beat={playback.beat} />
        <div
          role="group"
          aria-label={t.optionsLabel}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="flex min-h-full flex-col justify-center gap-2">
            {round.options.map((rhythm, index) => (
              <Option
                key={`${state.index}-${index}`}
                rhythm={rhythm}
                color={color}
                label={t.option(index + 1)}
                status={
                  !answered
                    ? null
                    : index === round.correctIndex
                      ? 'correct'
                      : index === picked
                        ? 'wrong'
                        : null
                }
                statusLabel={{ correct: t.correct, wrong: t.wrong }}
                disabled={answered}
                // A guarded tap that changes nothing would keep the guard locked and block Next.
                onClick={answered ? () => {} : guard(() => choose(index))}
              />
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </Stage>
    </GameShell>
  );
}

function Option({
  rhythm,
  color,
  label,
  status,
  statusLabel,
  disabled,
  onClick,
}: {
  rhythm: Rhythm;
  color: RoundColor;
  label: string;
  status: 'correct' | 'wrong' | null;
  statusLabel: Record<'correct' | 'wrong', string>;
  disabled: boolean;
  onClick: () => void;
}) {
  const text = status ? `${label}: ${statusLabel[status]}` : label;

  return (
    <button
      type="button"
      aria-label={text}
      aria-disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full shrink-0 flex-col gap-1 rounded-xl border-3 px-1 py-2 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
        status === 'wrong' ? 'border-dashed' : 'border-solid',
        disabled ? 'cursor-default' : 'cursor-pointer',
      )}
      style={{
        borderColor: status ? color.fg : `color-mix(in srgb, ${color.fg} 35%, transparent)`,
        backgroundColor:
          status === 'correct' ? `color-mix(in srgb, ${color.fg} 12%, transparent)` : undefined,
      }}
    >
      <span className="px-1 text-sm font-semibold">{text}</span>
      <Notation
        rhythm={rhythm}
        compact
        color={color.fg}
        highlightColor={color.highlight}
        className="w-full"
      />
    </button>
  );
}
