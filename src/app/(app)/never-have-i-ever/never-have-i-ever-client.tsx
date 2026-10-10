'use client';

import { useEffect } from 'react';

import { EndPhase } from './components/end-phase';
import { SetupPhase } from './components/setup-phase';
import { StatementPhase } from './components/statement-phase';
import { GameProvider, useNeverHaveIEverGame } from './game-provider';
import { GamePhase, Statement } from './types';

function NeverHaveIEverContent() {
  const { phase, locale } = useNeverHaveIEverGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'setup':
      return <SetupPhase />;
    case 'statement':
      return <StatementPhase />;
    case 'end':
      return <EndPhase />;
  }
}

export function NeverHaveIEverClient({ statements }: { statements: Statement[] }) {
  return (
    <GameProvider statements={statements}>
      <NeverHaveIEverContent />
    </GameProvider>
  );
}
