'use client';

import { EndScreen } from '@/components/game/end-screen';

import { otherTeam } from '../categories';
import { useCodenamesGame } from '../game-provider';

export function EndPhase() {
  const { winner, endReason, startGame, backToSetup, t } = useCodenamesGame();

  if (!winner || !endReason) return null;

  return (
    <EndScreen
      title={t.winTitle(t.teams[winner])}
      detail={t.endDetail[endReason](t.teams[winner], t.teams[otherTeam(winner)])}
      playAgainLabel={t.playAgain}
      homeLabel={t.backToSetup}
      onPlayAgain={startGame}
      onHome={backToSetup}
    />
  );
}
