'use client';

import Link from 'next/link';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { GlowButton, PhaseShell } from './game-shell';

export function EndPhase() {
  const { deck, backToSetup } = useTwoHundredQuestionsGame();

  return (
    <PhaseShell
      gradient="from-sky-950 via-black to-indigo-950"
      footer={
        <div className="flex flex-col gap-3">
          <GlowButton onClick={backToSetup}>Nochmal</GlowButton>
          <Link
            href="/"
            className="w-full min-h-14 flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 font-bold text-white text-lg transition-all active:scale-[0.98]"
          >
            Zur Startseite
          </Link>
        </div>
      }
    >
      <div className="text-7xl" aria-hidden>
        🎉
      </div>
      <h1 className="text-white font-black text-center text-[clamp(2rem,10vw,3rem)] leading-tight drop-shadow-[0_0_20px_rgba(14,165,233,0.4)]">
        Alle Fragen durch!
      </h1>
      <p className="text-white/50 text-center tabular-nums">{deck.length} Fragen gespielt</p>
    </PhaseShell>
  );
}
