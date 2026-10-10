'use client';

import { useEffect, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';

import { useGame } from '../game-provider';
import { PLAYING_COLOR } from '../palette';

const END_ROUND_LABELS = {
  quit: 'End round',
  quitTitle: 'End the round?',
  quitDescription: 'You go back to the setup. Players and settings are kept.',
  keepPlaying: 'Keep playing',
};

const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayingPhase = () => {
  const { gameState, finishGame } = useGame();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Picked once so it does not change on every tick.
  const [startPlayer] = useState(
    () => gameState.players[Math.floor(Math.random() * gameState.players.length)],
  );

  const imposters = gameState.imposterCount;
  const civilians = gameState.players.length - imposters;

  return (
    <GameShell
      color={PLAYING_COLOR}
      lang="en"
      labels={END_ROUND_LABELS}
      onQuit={finishGame}
      className="flex flex-col"
    >
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pt-[calc(env(safe-area-inset-top)+4rem)] pb-[max(3rem,env(safe-area-inset-bottom))] text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-base font-medium md:text-xl">Starts the round</span>
          <span className="text-5xl leading-tight font-bold tracking-tight wrap-break-word hyphens-auto md:text-7xl">
            {startPlayer}
          </span>
        </div>
        <span
          role="timer"
          aria-label={`Round time ${formatTime(seconds)}`}
          className="text-7xl leading-none font-bold tracking-tight tabular-nums md:text-9xl"
        >
          {formatTime(seconds)}
        </span>
        <span className="text-lg font-medium tabular-nums md:text-2xl">
          {imposters} {imposters === 1 ? 'imposter' : 'imposters'}, {civilians}{' '}
          {civilians === 1 ? 'civilian' : 'civilians'}
        </span>
      </main>
    </GameShell>
  );
};
