'use client';

import { useEffect } from 'react';

import { BoardPhase } from './components/board-phase';
import { EndPhase } from './components/end-phase';
import { SetupPhase } from './components/setup-phase';
import { GameProvider, useCodenamesGame } from './game-provider';
import { GamePhase, Word } from './types';

function CodenamesContent() {
  const { phase, locale } = useCodenamesGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'setup':
      return <SetupPhase />;
    case 'playing':
      return <BoardPhase />;
    case 'end':
      return <EndPhase />;
  }
}

export function CodenamesClient({ words }: { words: Word[] }) {
  return (
    <GameProvider words={words}>
      <CodenamesContent />
    </GameProvider>
  );
}
