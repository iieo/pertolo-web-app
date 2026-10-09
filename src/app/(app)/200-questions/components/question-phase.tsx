'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { questionColor } from '../palette';
import { QuestionText, TapScreen } from './game-shell';

export function QuestionPhase() {
  const { currentQuestionText, currentIndex, isLastQuestion, nextQuestion, t } =
    useTwoHundredQuestionsGame();
  if (currentQuestionText === null) return null;

  return (
    <TapScreen
      color={questionColor(currentIndex)}
      hint={isLastQuestion ? t.lastQuestionHint : t.nextQuestionHint}
      onAdvance={nextQuestion}
    >
      <QuestionText text={currentQuestionText} />
    </TapScreen>
  );
}
