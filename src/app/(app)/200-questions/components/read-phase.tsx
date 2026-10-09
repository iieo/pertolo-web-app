'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { questionColor } from '../palette';
import { QuestionText, TapScreen } from './game-shell';

export function ReadPhase() {
  const { currentQuestionText, currentIndex, passOn, t } = useTwoHundredQuestionsGame();
  if (currentQuestionText === null) return null;

  return (
    <TapScreen color={questionColor(currentIndex)} hint={t.readHint} onAdvance={passOn}>
      <QuestionText text={currentQuestionText} />
    </TapScreen>
  );
}
