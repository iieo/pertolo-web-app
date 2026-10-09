'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { CategoryBadge, GameHeader, GlowButton, PhaseShell, QuestionText } from './game-shell';

export function RevealPhase() {
  const { currentQuestion, drinkEnabled, isLastQuestion, nextQuestion } =
    useTwoHundredQuestionsGame();
  if (!currentQuestion) return null;

  return (
    <PhaseShell
      gradient="from-sky-950 via-black to-cyan-950"
      header={<GameHeader />}
      footer={
        <GlowButton onClick={nextQuestion}>
          {isLastQuestion ? 'Spiel beenden' : 'Nächste Frage'}
        </GlowButton>
      }
    >
      <CategoryBadge category={currentQuestion.category} />
      <QuestionText text={currentQuestion.question} />
      <p className="text-sky-300/80 text-sm font-semibold text-center max-w-xs leading-relaxed">
        Lies die Frage laut vor
      </p>
      {drinkEnabled && (
        <div className="px-5 py-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 font-bold text-center">
          🍺 Trink einen Schluck
        </div>
      )}
    </PhaseShell>
  );
}
