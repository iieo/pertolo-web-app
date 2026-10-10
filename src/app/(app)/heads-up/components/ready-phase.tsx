'use client';

import { enterFullscreen, exitFullscreen } from '@/components/game/fullscreen';
import { PageShell, primaryButtonClass, secondaryButtonClass } from '@/components/game/page-shell';

import { lockLandscape, unlockOrientation } from '../device';
import { useHeadsUpGame } from '../game-provider';

export function ReadyPhase() {
  const { tiltEnabled, beginRound, backToSetup, t } = useHeadsUpGame();

  const steps = tiltEnabled
    ? [t.readyHold, t.readyTiltDown, t.readyTiltUp, t.readyTap]
    : [t.readyHold, t.readyTapOnly];

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
            {t.go}
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
      <div className="flex flex-1 flex-col justify-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t.readyTitle}</h1>
        <ul className="flex flex-col gap-4 text-lg leading-relaxed text-white/80">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
