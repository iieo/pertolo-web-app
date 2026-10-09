'use client';

import { useTwoHundredQuestionsGame } from '../game-provider';
import { NEUTRAL_COLOR } from '../palette';
import { QuestionText, TapScreen } from './game-shell';

export function HandoverPhase() {
  const { reveal, t } = useTwoHundredQuestionsGame();

  return (
    <TapScreen color={NEUTRAL_COLOR} hint={t.handoverHint} onAdvance={reveal}>
      <QuestionText text={t.handoverText} />
    </TapScreen>
  );
}
