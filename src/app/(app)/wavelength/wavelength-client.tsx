'use client';

import { useEffect } from 'react';

import { EndPhase } from './components/end-phase';
import { RoundPhase } from './components/round-phase';
import { SetupPhase } from './components/setup-phase';
import { GameProvider, useWavelengthGame } from './game-provider';
import { GamePhase, Spectrum } from './types';

function WavelengthContent() {
  const { phase, locale } = useWavelengthGame();
  const inSetupOrEnd = phase === 'setup' || phase === 'end';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [inSetupOrEnd]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'setup':
      return <SetupPhase />;
    case 'clue':
    case 'guess':
    case 'reveal':
      return <RoundPhase />;
    case 'end':
      return <EndPhase />;
  }
}

export function WavelengthClient({ spectrums }: { spectrums: Spectrum[] }) {
  return (
    <GameProvider spectrums={spectrums}>
      <WavelengthContent />
    </GameProvider>
  );
}
