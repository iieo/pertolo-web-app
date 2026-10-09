'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { CategoryBadge, GameHeader, GlowButton, PhaseShell, QuestionText } from './game-shell';

export function ReadPhase() {
  const { currentQuestion, passOn } = useTwoHundredQuestionsGame();
  if (!currentQuestion) return null;

  return (
    <PhaseShell
      gradient="from-indigo-950 via-black to-sky-950"
      header={<GameHeader />}
      footer={<GlowButton onClick={passOn}>Weitergeben</GlowButton>}
    >
      <CategoryBadge category={currentQuestion.category} />
      <QuestionText text={currentQuestion.question} />
      <p className="text-white/40 text-sm text-center max-w-xs leading-relaxed">
        Lies still. Auf wen trifft das am meisten zu?
      </p>
    </PhaseShell>
  );
}
