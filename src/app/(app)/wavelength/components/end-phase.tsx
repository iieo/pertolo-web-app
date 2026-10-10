'use client';

import { EndScreen } from '@/components/game/end-screen';

import { useWavelengthGame } from '../game-provider';
import { MAX_POINTS } from '../scoring';

export function EndPhase() {
  const { rounds, scores, teamCount, backToSetup, t } = useWavelengthGame();
  const [a, b] = scores;

  const title =
    teamCount === 1 ? t.endTitleCoop(a) : a === b ? t.endTitleTie : t.endTitleWinner(a > b ? 0 : 1);
  const detail =
    teamCount === 1
      ? t.endDetailCoop(rounds.length, rounds.length * MAX_POINTS)
      : t.endDetailTeams(a, b, rounds.length);

  return (
    <EndScreen
      title={title}
      detail={detail}
      playAgainLabel={t.playAgain}
      homeLabel={t.backHome}
      onPlayAgain={backToSetup}
    />
  );
}
