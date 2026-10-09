'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { GameHeader, GlowButton, PhaseShell } from './game-shell';

export function HandoverPhase() {
  const { reveal } = useTwoHundredQuestionsGame();

  return (
    <PhaseShell
      gradient="from-slate-900 via-black to-slate-950"
      header={<GameHeader />}
      footer={<GlowButton onClick={reveal}>Aufdecken</GlowButton>}
    >
      <div className="text-6xl" aria-hidden>
        🤫
      </div>
      <p className="text-white font-black text-center text-[clamp(1.5rem,7vw,2.25rem)] leading-tight wrap-break-word">
        Gib das Handy verdeckt an die Person, auf die die Frage zutrifft
      </p>
      <p className="text-white/40 text-sm text-center max-w-xs leading-relaxed">
        Erst die Person mit dem Handy tippt auf Aufdecken.
      </p>
    </PhaseShell>
  );
}
