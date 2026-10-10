'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  PageShell,
  QuestionText,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/app/(app)/200-questions/components/game-shell';
import { exitFullscreen } from '@/app/(app)/200-questions/fullscreen';
import { questionColor } from '@/app/(app)/200-questions/palette';

import { categoryColorIndex } from '../categories';
import { useDrinkGame } from '../game-provider';
import { TapScreen } from './tap-screen';

export default function GamePage() {
  const router = useRouter();
  const { category, deck, currentIndex, currentTask, finished, nextTask, restart, endGame } =
    useDrinkGame();

  const hasGame = category !== null && deck.length > 0;

  // The deck lives in memory only, so a reload or direct visit starts at the category screen.
  useEffect(() => {
    if (!hasGame) router.replace('/drink/mode');
  }, [hasGame, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [finished]);

  if (!hasGame) return null;

  function quit() {
    exitFullscreen();
    endGame();
  }

  if (finished) {
    return (
      <PageShell
        footer={
          <div className="flex flex-col gap-2">
            <button type="button" className={primaryButtonClass} onClick={restart}>
              Neue Runde
            </button>
            <button type="button" className={secondaryButtonClass} onClick={quit}>
              Andere Kategorie
            </button>
          </div>
        }
      >
        <div className="flex flex-1 flex-col justify-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Runde vorbei</h1>
          <p className="text-base leading-relaxed text-white/60 tabular-nums">
            {deck.length === 1
              ? 'Ihr habt die einzige Aufgabe gespielt.'
              : `Ihr habt alle ${deck.length} Aufgaben gespielt.`}
          </p>
        </div>
      </PageShell>
    );
  }

  if (currentTask === null) return null;

  return (
    <TapScreen
      color={questionColor(categoryColorIndex(category.name, 0) + currentIndex)}
      advanceKey={currentIndex}
      onAdvance={nextTask}
      onQuit={quit}
    >
      <QuestionText text={currentTask} />
    </TapScreen>
  );
}
