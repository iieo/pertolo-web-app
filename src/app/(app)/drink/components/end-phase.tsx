'use client';

import { EndScreen } from '@/components/game/end-screen';

import { useDrinkGame } from '../game-provider';

export function EndPhase() {
  const { playedCount, backToSetup, t } = useDrinkGame();

  return (
    <EndScreen
      title={t.endTitle}
      detail={t.tasksPlayed(playedCount)}
      playAgainLabel={t.playAgain}
      homeLabel={t.backHome}
      onPlayAgain={backToSetup}
    />
  );
}
