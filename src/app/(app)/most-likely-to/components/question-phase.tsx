'use client';

import { useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';

import { useMostLikelyToGame } from '../game-provider';
import { questionColor } from '../palette';

function phraseFontSize(length: number) {
  if (length <= 40) return 'clamp(2.25rem, min(11vw, 8dvh), 6rem)';
  if (length <= 80) return 'clamp(1.875rem, min(8.5vw, 6.5dvh), 4.75rem)';
  if (length <= 120) return 'clamp(1.5rem, min(7.5vw, 5.5dvh), 4rem)';
  return 'clamp(1.375rem, min(6.5vw, 4.75dvh), 3.25rem)';
}

export function QuestionPhase() {
  const {
    currentQuestionText,
    currentIndex,
    isLastQuestion,
    nextQuestion,
    backToSetup,
    locale,
    t,
  } = useMostLikelyToGame();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const guard = useTapGuard(currentIndex, { focusRef: buttonRef });

  if (currentQuestionText === null) return null;

  return (
    <GameShell
      color={questionColor(currentIndex)}
      lang={locale}
      labels={t}
      onQuit={backToSetup}
      className="transition-colors duration-150 motion-reduce:transition-none"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={guard(nextQuestion)}
        className="absolute inset-0 block h-full w-full cursor-pointer text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
      >
        <span className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center gap-4 pt-[calc(env(safe-area-inset-top)+4rem)] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] md:gap-6 lg:max-w-4xl">
          <span className="block text-xl font-semibold md:text-3xl">{t.prefix}</span>
          <span
            className="block font-bold tracking-tight text-pretty wrap-break-word hyphens-auto"
            style={{ fontSize: phraseFontSize(currentQuestionText.length), lineHeight: 1.15 }}
          >
            {currentQuestionText}?
          </span>
          <span className="sr-only">
            {isLastQuestion ? t.lastQuestionHint : t.nextQuestionHint}
          </span>
        </span>
      </button>
    </GameShell>
  );
}
