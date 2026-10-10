'use client';

import { enterFullscreen, exitFullscreen } from '@/components/game/fullscreen';
import { PageShell, primaryButtonClass, secondaryButtonClass } from '@/components/game/page-shell';

import { lockLandscape, unlockOrientation } from '../device';
import { useHeadsUpGame } from '../game-provider';

export function ResultPhase() {
  const { results, beginRound, backToSetup, locale, t } = useHeadsUpGame();
  const score = results.filter((r) => r.correct).length;

  return (
    <PageShell
      footer={
        <div className="flex flex-col gap-2 landscape:flex-row">
          <button
            type="button"
            className={primaryButtonClass}
            onClick={() => {
              enterFullscreen().then(lockLandscape);
              beginRound();
            }}
          >
            {t.nextRound}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => {
              unlockOrientation();
              exitFullscreen();
              backToSetup();
            }}
          >
            {t.backToSetup}
          </button>
        </div>
      }
    >
      <h1 className="text-5xl font-bold tracking-tight tabular-nums md:text-6xl">
        {t.score(score)}
      </h1>
      <p className="mt-2 text-base text-white/60 tabular-nums">{t.outOf(results.length)}</p>

      <section className="mt-12" aria-labelledby="round-words-label">
        <h2 id="round-words-label" className="mb-4 text-base font-semibold">
          {t.roundWords}
        </h2>
        {results.length === 0 ? (
          <p className="text-base text-white/60">{t.noWords}</p>
        ) : (
          <ol className="flex flex-col gap-2 text-xl font-semibold">
            {results.map(({ word, correct }, index) => (
              <li
                key={`${word.id}-${index}`}
                className={correct ? 'text-white' : 'text-white/50 line-through'}
              >
                {locale === 'en' ? word.wordEn : word.word}
                {!correct && <span className="sr-only">, {t.passed}</span>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </PageShell>
  );
}
