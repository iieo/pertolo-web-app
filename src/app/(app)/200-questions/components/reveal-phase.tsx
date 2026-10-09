'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { questionColor } from '../palette';
import { QuestionText, TapScreen } from './game-shell';

export function RevealPhase() {
  const { currentQuestionText, currentIndex, drinkEnabled, isLastQuestion, nextQuestion, t } =
    useTwoHundredQuestionsGame();
  if (currentQuestionText === null) return null;

  return (
    <TapScreen
      color={questionColor(currentIndex)}
      hint={isLastQuestion ? t.revealHintLast : t.revealHintNext}
      onAdvance={nextQuestion}
    >
      <span className="block text-base leading-relaxed">{t.revealPrompt}</span>
      <QuestionText text={currentQuestionText} />
      {drinkEnabled && (
        <span className="block text-base leading-relaxed font-semibold">{t.revealDrink}</span>
      )}
    </TapScreen>
  );
}
