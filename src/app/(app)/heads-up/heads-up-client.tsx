'use client';

import { useEffect } from 'react';

import { ReadyPhase } from './components/ready-phase';
import { ResultPhase } from './components/result-phase';
import { RoundPhase } from './components/round-phase';
import { SetupPhase } from './components/setup-phase';
import { GameProvider, useHeadsUpGame } from './game-provider';
import { GamePhase, Word } from './types';

function HeadsUpContent() {
  const { phase, locale } = useHeadsUpGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'setup':
      return <SetupPhase />;
    case 'ready':
      return <ReadyPhase />;
    // Countdown and playing share one mounted component, so tilt calibration and the wake
    // lock carry over into the round.
    case 'countdown':
    case 'playing':
      return <RoundPhase />;
    case 'result':
      return <ResultPhase />;
  }
}

export function HeadsUpClient({ words }: { words: Word[] }) {
  return (
    <GameProvider words={words}>
      <HeadsUpContent />
    </GameProvider>
  );
}
