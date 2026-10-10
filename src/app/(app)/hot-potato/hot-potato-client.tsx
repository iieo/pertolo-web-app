'use client';

import { useEffect } from 'react';

import { EndPhase } from './components/end-phase';
import { RoundPhase } from './components/round-phase';
import { SetupPhase } from './components/setup-phase';
import { GameProvider, useHotPotatoGame } from './game-provider';
import { GamePhase, Prompt } from './types';

function HotPotatoContent() {
  const { phase, locale } = useHotPotatoGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'setup':
      return <SetupPhase />;
    case 'prompt':
    case 'ticking':
    case 'boom':
      return <RoundPhase />;
    case 'end':
      return <EndPhase />;
  }
}

export function HotPotatoClient({ prompts }: { prompts: Prompt[] }) {
  return (
    <GameProvider prompts={prompts}>
      <HotPotatoContent />
    </GameProvider>
  );
}
