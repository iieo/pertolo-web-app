'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useBluffGame } from '../game-provider';

export function WordPhase() {
  const { currentWord, revealSecret } = useBluffGame();
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col md:max-w-lg md:mx-auto">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950 via-black to-purple-950 pointer-events-none" />

      <div className="relative flex flex-col flex-1 p-5">
        {/* Header */}
        <header className="flex justify-end mb-2">
          <button
            onClick={() => setRulesOpen(true)}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-lg hover:bg-white/20 transition-colors active:scale-95"
            aria-label="How to play"
          >
            ?
          </button>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
          {/* Decorative badge */}
          <div className="px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/40">
            <span className="text-violet-300 text-xs font-bold tracking-widest uppercase">
              Dein Wort
            </span>
          </div>

          {/* Word */}
          <div className="text-center px-4">
            <h2
              className="text-white font-black leading-none tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              style={{ fontSize: 'clamp(3.5rem, 16vw, 6.5rem)' }}
            >
              {currentWord.word}
            </h2>
            <p className="text-violet-400 text-lg font-medium mt-3 tracking-wider">
              [{currentWord.pronunciation}]
            </p>
          </div>

          {/* Instruction hint */}
          <p className="text-white/40 text-sm text-center max-w-xs leading-relaxed px-4">
            Lies das Wort laut vor und drücke dann heimlich unten drauf.
          </p>
        </div>

        {/* Reveal button */}
        <div className="pb-6">
          <button
            onClick={revealSecret}
            className="w-full py-6 rounded-2xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all font-black text-white text-xl tracking-wide shadow-[0_0_40px_-4px_rgba(139,92,246,0.6)] border border-violet-500/50"
          >
            Aufdecken
          </button>
          <p className="text-center text-white/25 text-xs mt-3 tracking-wide">
            Sieh dir das Ergebnis heimlich an!
          </p>
        </div>
      </div>

      {/* Rules Dialog */}
      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
        <DialogContent className="bg-[#0e0e14] border border-white/10 text-white rounded-3xl max-w-sm mx-4 p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-black text-center">
              Spielregeln
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <RuleStep number="1" color="violet">
              Der aktuelle Spieler hält das Handy. Lies das angezeigte Wort laut für die Gruppe vor.
            </RuleStep>
            <RuleStep number="2" color="violet">
              Tippe auf <strong>"Aufdecken"</strong> und lies dein Ergebnis heimlich. Die Gruppe
              darf es NICHT sehen.
            </RuleStep>
            <RuleStep number="3" color="green">
              Wenn du <span className="text-emerald-400 font-bold">WAHRHEIT</span> erhältst, lies
              die echte Bedeutung selbstbewusst vor.
            </RuleStep>
            <RuleStep number="4" color="red">
              Wenn du <span className="text-rose-400 font-bold">BLUFF</span> erhältst, erfinde
              spontan eine überzeugende, falsche Definition!
            </RuleStep>
            <RuleStep number="5" color="violet">
              Die Gruppe stimmt ab: Wahr oder Bluff? Wenn sie falsch raten, gewinnt der Spieler die
              Runde!
            </RuleStep>
          </div>

          <Button
            onClick={() => setRulesOpen(false)}
            className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white font-bold text-base py-5 rounded-xl"
          >
            Verstanden!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RuleStep({
  number,
  children,
}: {
  number: string;
  color: 'violet' | 'green' | 'red';
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="min-w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
        {number}
      </span>
      <p className="text-white/80 text-sm leading-relaxed pt-0.5">{children}</p>
    </div>
  );
}
