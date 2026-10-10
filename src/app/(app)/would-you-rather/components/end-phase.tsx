'use client';

import Link from 'next/link';

import { exitFullscreen } from '../fullscreen';
import { useWouldYouRatherGame } from '../game-provider';
import { PageShell, primaryButtonClass, secondaryButtonClass } from './game-shell';

export function EndPhase() {
  const { deck, backToSetup, t } = useWouldYouRatherGame();

  return (
    <PageShell
      footer={
        <div className="flex flex-col gap-2">
          <button type="button" className={primaryButtonClass} onClick={backToSetup}>
            {t.playAgain}
          </button>
          <Link href="/" className={secondaryButtonClass} onClick={() => exitFullscreen()}>
            {t.backHome}
          </Link>
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{t.endTitle}</h1>
        <p className="text-base leading-relaxed text-white/60 tabular-nums">
          {t.questionsPlayed(deck.length)}
        </p>
      </div>
    </PageShell>
  );
}
