'use client';

import { useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';

import { useBluffGame } from '../game-provider';
import { QUIT_LABELS } from '../labels';
import { wordColor } from '../palette';

function wordFontSize(length: number) {
  if (length <= 8) return 'clamp(3rem, 16cqi, 9rem)';
  if (length <= 14) return 'clamp(2.5rem, 11cqi, 7rem)';
  return 'clamp(2rem, 8cqi, 5rem)';
}

export function WordPhase({ onQuit }: { onQuit: () => void }) {
  const { currentWord, revealSecret } = useBluffGame();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const guarded = useTapGuard(currentWord.word, { focusRef: buttonRef });
  const color = wordColor(currentWord.word);

  return (
    <GameShell
      color={color}
      lang="de"
      labels={QUIT_LABELS}
      onQuit={onQuit}
      className="flex flex-col"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${currentWord.word}. Tippen, um heimlich aufzudecken`}
        onClick={guarded(revealSecret)}
        className="@container flex h-full w-full flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden px-6 pt-[calc(env(safe-area-inset-top)+4rem)] pb-[max(3rem,env(safe-area-inset-bottom))] text-center outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
      >
        <span className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4">
          <span
            className="block w-full leading-tight font-bold tracking-tight wrap-break-word hyphens-auto"
            style={{ fontSize: wordFontSize(currentWord.word.length) }}
          >
            {currentWord.word}
          </span>
          <span className="block text-xl font-medium md:text-3xl">
            [{currentWord.pronunciation}]
          </span>
        </span>
      </button>
    </GameShell>
  );
}
