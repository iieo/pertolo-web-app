'use client';

import { useEffect } from 'react';

import { EndPhase } from './components/end-phase';
import { QuestionPhase } from './components/question-phase';
import { SetupPhase } from './components/setup-phase';
import { GameProvider, useHotTakesGame } from './game-provider';
import { GamePhase, Take } from './types';

function HotTakesContent() {
  const { phase, locale } = useHotTakesGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'setup':
      return <SetupPhase />;
    case 'question':
      return <QuestionPhase />;
    case 'end':
      return <EndPhase />;
  }
}

export function HotTakesClient({ takes }: { takes: Take[] }) {
  return (
    <GameProvider takes={takes}>
      <HotTakesContent />
    </GameProvider>
  );
}
