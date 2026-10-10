'use client';

import { EndScreen } from '@/components/game/end-screen';

import { useNeverHaveIEverGame } from '../game-provider';

export function EndPhase() {
  const { deck, backToSetup, t } = useNeverHaveIEverGame();

  return (
    <EndScreen
      title={t.endTitle}
      detail={t.statementsPlayed(deck.length)}
      playAgainLabel={t.playAgain}
      homeLabel={t.backHome}
      onPlayAgain={backToSetup}
    />
  );
}
