'use client';

import { EndScreen } from '@/components/game/end-screen';

import { useMostLikelyToGame } from '../game-provider';

export function EndPhase() {
  const { deck, backToSetup, t } = useMostLikelyToGame();

  return (
    <EndScreen
      title={t.endTitle}
      detail={t.questionsPlayed(deck.length)}
      playAgainLabel={t.playAgain}
      homeLabel={t.backHome}
      onPlayAgain={backToSetup}
    />
  );
}
