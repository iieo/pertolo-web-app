'use client';

import { useEffect } from 'react';

import { EndPhase } from './components/end-phase';
import { QuestionPhase } from './components/question-phase';
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
    case 'question':
      return <QuestionPhase />;
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
