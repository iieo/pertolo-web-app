'use client';

import { useEffect } from 'react';

import { EndPhase } from './components/end-phase';
import { HandoverPhase } from './components/handover-phase';
import { ReadPhase } from './components/read-phase';
import { RevealPhase } from './components/reveal-phase';
import { SetupPhase } from './components/setup-phase';
import { GameProvider, useTwoHundredQuestionsGame } from './game-provider';
import { GamePhase, Question } from './types';

function TwoHundredQuestionsContent() {
  const { phase, locale } = useTwoHundredQuestionsGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'setup':
      return <SetupPhase />;
    case 'read':
      return <ReadPhase />;
    case 'handover':
      return <HandoverPhase />;
    case 'reveal':
      return <RevealPhase />;
    case 'end':
      return <EndPhase />;
  }
}

export function TwoHundredQuestionsClient({ questions }: { questions: Question[] }) {
  return (
    <GameProvider questions={questions}>
      <TwoHundredQuestionsContent />
    </GameProvider>
  );
}
