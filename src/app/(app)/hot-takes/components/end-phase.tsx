'use client';

import { EndScreen } from '@/components/game/end-screen';

import { useHotTakesGame } from '../game-provider';

export function EndPhase() {
  const { deck, backToSetup, t } = useHotTakesGame();

  return (
    <EndScreen
      title={t.endTitle}
      detail={t.takesPlayed(deck.length)}
      playAgainLabel={t.playAgain}
      homeLabel={t.backHome}
      onPlayAgain={backToSetup}
    />
  );
}
