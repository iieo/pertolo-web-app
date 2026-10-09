'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { questionColor } from '../palette';
import { QuestionText, TapScreen } from './game-shell';

export function RevealPhase() {
  const { currentQuestionText, currentIndex, isLastQuestion, nextQuestion, t } =
    useTwoHundredQuestionsGame();
  if (currentQuestionText === null) return null;

  return (
    <TapScreen
      color={questionColor(currentIndex)}
      hint={isLastQuestion ? t.revealHintLast : t.revealHintNext}
      onAdvance={nextQuestion}
    >
      <QuestionText text={currentQuestionText} />
    </TapScreen>
  );
}
