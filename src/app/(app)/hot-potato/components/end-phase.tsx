'use client';

import { EndScreen } from '@/components/game/end-screen';

import { useHotPotatoGame } from '../game-provider';

export function EndPhase() {
  const { deck, backToSetup, t } = useHotPotatoGame();

  return (
    <EndScreen
      title={t.endTitle}
      detail={t.promptsPlayed(deck.length)}
      playAgainLabel={t.playAgain}
      homeLabel={t.backHome}
      onPlayAgain={backToSetup}
    />
  );
}
