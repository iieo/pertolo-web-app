'use client';

import { useRef } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';

import { useBluffGame } from '../game-provider';
import { QUIT_LABELS } from '../labels';
import { wordColor } from '../palette';

export function SecretPhase({ onQuit }: { onQuit: () => void }) {
  const { currentWord, secretType, nextWord } = useBluffGame();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const guarded = useTapGuard(secretType ?? '', { focusRef: buttonRef });
  // Truth and bluff share the word's color, so the group cannot read the result from across the table.
  const color = wordColor(currentWord.word);
  const isTruth = secretType === 'truth';

  return (
    <GameShell
      color={color}
      lang="de"
      labels={QUIT_LABELS}
      onQuit={() => {
        nextWord();
        onQuit();
      }}
      className="flex flex-col"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${isTruth ? 'Wahrheit' : 'Bluff'}. Tippen für das nächste Wort`}
        onClick={guarded(nextWord)}
        className="@container flex h-full w-full flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden px-6 pt-[calc(env(safe-area-inset-top)+4rem)] pb-[max(3rem,env(safe-area-inset-bottom))] text-center outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
      >
        <span className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 lg:max-w-3xl">
          <span className="block text-base font-medium wrap-break-word hyphens-auto md:text-xl">
            {currentWord.word}
          </span>
          <span
            className="block leading-none font-bold tracking-tight"
            style={{ fontSize: 'clamp(3rem, 15cqi, 8rem)' }}
          >
            {isTruth ? 'Wahrheit' : 'Bluff'}
          </span>

          {isTruth ? (
            <>
              <span
                className={`block leading-snug font-semibold text-pretty ${
                  currentWord.definition.length > 70
                    ? 'text-xl md:text-3xl'
                    : 'text-2xl md:text-4xl'
                }`}
              >
                {currentWord.definition}
              </span>
              <span className="block max-w-md text-base leading-relaxed font-medium md:text-lg">
                Lies die echte Bedeutung selbstbewusst vor.
              </span>
            </>
          ) : (
            <>
              <span className="block text-2xl leading-snug font-semibold md:text-4xl">
                Erfinde etwas. Jetzt sofort.
              </span>
              <span className="mt-4 flex flex-col gap-1">
                <span className="text-sm font-medium md:text-base">
                  Echte Bedeutung, für später
                </span>
                <span className="text-base leading-relaxed text-pretty md:text-lg">
                  {currentWord.definition}
                </span>
              </span>
            </>
          )}
        </span>
      </button>
    </GameShell>
  );
}
