'use client';

import { useRef, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';

import { useGame } from '../game-provider';
import { playerColor } from '../palette';

const SWIPE_DISTANCE = 60;

const QUIT_LABELS = {
  quit: 'Quit',
  quitTitle: 'Quit the game?',
  quitDescription: 'You go back to the setup. Players and settings are kept.',
  keepPlaying: 'Keep playing',
};

function wordFontSize(length: number) {
  if (length <= 10) return 'clamp(3rem, 16cqi, 9rem)';
  if (length <= 18) return 'clamp(2.25rem, 11cqi, 6.5rem)';
  return 'clamp(1.75rem, 8cqi, 4.5rem)';
}

export const RevealPhase = () => {
  const { gameState, nextPlayer, categories, finishGame } = useGame();
  const [isRevealed, setIsRevealed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStartY = useRef<number | null>(null);
  const swiped = useRef(false);
  const guarded = useTapGuard(isRevealed ? 1 : 0, { focusRef: buttonRef });

  const index = gameState.currentPlayerIndex;
  const currentPlayer = gameState.players[index];
  const isImposter = gameState.imposters.has(index);
  const isLast = index >= gameState.players.length - 1;
  const selectedCategory = categories.find((c) => c.id === gameState.selectedCategoryId);
  // Revealed screens use the same color for imposters and everyone else, so nothing shows across the table.
  const color = playerColor(index);

  const reveal = guarded(() => setIsRevealed(true));
  const advance = guarded(nextPlayer);

  return (
    <GameShell
      color={color}
      lang="en"
      labels={QUIT_LABELS}
      onQuit={finishGame}
      className="flex flex-col"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={
          isRevealed
            ? isLast
              ? 'Hide and start the round'
              : 'Hide and pass to the next player'
            : `${currentPlayer}, show your word`
        }
        onClick={() => {
          // The click that ends a reveal swipe must not also advance.
          if (swiped.current) {
            swiped.current = false;
            return;
          }
          (isRevealed ? advance : reveal)();
        }}
        onPointerDown={(e) => {
          swiped.current = false;
          dragStartY.current = isRevealed ? null : e.clientY;
        }}
        onPointerMove={(e) => {
          if (dragStartY.current === null) return;
          if (dragStartY.current - e.clientY > SWIPE_DISTANCE) {
            dragStartY.current = null;
            swiped.current = true;
            reveal();
          }
        }}
        className="@container flex h-full w-full flex-1 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden px-6 pt-[calc(env(safe-area-inset-top)+4rem)] pb-[max(3rem,env(safe-area-inset-bottom))] text-center outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
        style={{ touchAction: isRevealed ? 'manipulation' : 'none' }}
      >
        <span className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4">
          {isRevealed ? (
            isImposter ? (
              <>
                <span className="block text-base font-medium md:text-xl">{currentPlayer}</span>
                <span
                  className="block leading-none font-bold tracking-tight"
                  style={{ fontSize: wordFontSize(8) }}
                >
                  Imposter
                </span>
                {gameState.showCategoryToImposter && selectedCategory ? (
                  <span className="mt-4 flex flex-col gap-1">
                    <span className="text-base font-medium md:text-xl">Category</span>
                    <span className="text-3xl font-bold tracking-tight wrap-break-word hyphens-auto md:text-5xl">
                      {selectedCategory.name}
                    </span>
                  </span>
                ) : (
                  <span className="mt-4 max-w-md text-xl leading-snug font-medium md:text-2xl">
                    Blend in. Don&apos;t let them know you don&apos;t know.
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="block text-base font-medium md:text-xl">Your secret word</span>
                <span
                  className="block w-full leading-tight font-bold tracking-tight wrap-break-word hyphens-auto"
                  style={{ fontSize: wordFontSize(gameState.selectedWord?.length ?? 0) }}
                >
                  {gameState.selectedWord}
                </span>
              </>
            )
          ) : (
            <>
              <span
                className="block leading-tight font-bold tracking-tight wrap-break-word hyphens-auto"
                style={{ fontSize: wordFontSize(currentPlayer?.length ?? 0) }}
              >
                {currentPlayer}
              </span>
              <span className="block text-xl font-medium md:text-2xl">Tap to see your word</span>
            </>
          )}
        </span>
      </button>
    </GameShell>
  );
};
