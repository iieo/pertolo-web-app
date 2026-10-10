'use client';

import { useEffect, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import type { Locale } from '@/components/game/locale';

import type { Dictionary } from '../i18n';
import { roundColor } from '../palette';
import type { Level, Rhythm } from '../rhythm';
import { nextRhythm } from '../rounds';
import { usePlayback } from '../use-playback';
import { Notation } from './notation';
import { Controls, CountIn, Stage } from './stage';

export type GameConfig = {
  level: Level;
  tempo: number;
  measures: number;
  metronome: boolean;
};

type Round = { index: number; rhythm: Rhythm; revealed: boolean };

/** Listen and Read share one screen: Listen hides the notation until Reveal, Read shows it. */
export function TrainerPhase({
  mode,
  config,
  locale,
  t,
  onQuit,
}: {
  mode: 'listen' | 'read';
  config: GameConfig;
  locale: Locale;
  t: Dictionary;
  onQuit: () => void;
}) {
  const [round, setRound] = useState<Round>(() => ({
    index: 0,
    rhythm: nextRhythm(config.level, config.measures),
    revealed: false,
  }));
  const playback = usePlayback(config);
  const { play, stop } = playback;
  const guard = useTapGuard(`${round.index}-${round.revealed}-${playback.version}`);
  const color = roundColor(round.index);
  const listen = mode === 'listen';
  const hidden = listen && !round.revealed;

  useEffect(() => {
    if (mode !== 'listen') return;
    play(round.rhythm);
    return stop;
  }, [mode, round.rhythm, play, stop]);

  const nextRound = () => {
    stop();
    setRound((r) => ({
      index: r.index + 1,
      rhythm: nextRhythm(config.level, config.measures, r.rhythm),
      revealed: false,
    }));
  };

  const replay = () => play(round.rhythm);

  const primary = listen
    ? round.revealed
      ? { label: t.next, onClick: guard(nextRound) }
      : { label: t.reveal, onClick: guard(() => setRound((r) => ({ ...r, revealed: true }))) }
    : playback.playing
      ? { label: t.stop, onClick: guard(stop) }
      : { label: t.play, onClick: guard(replay) };

  const secondary = listen
    ? { label: t.again, onClick: guard(replay) }
    : { label: t.next, onClick: guard(nextRound) };

  return (
    <GameShell
      color={color}
      lang={locale}
      labels={t}
      onQuit={() => {
        stop();
        onQuit();
      }}
      className="transition-colors duration-150 motion-reduce:transition-none"
    >
      <Stage controls={<Controls color={color} primary={primary} secondary={secondary} />}>
        <CountIn beat={playback.beat} />
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <Notation
            rhythm={round.rhythm}
            hidden={hidden}
            activeIndex={hidden ? null : playback.activeIndex}
            color={color.fg}
            highlightColor={color.highlight}
            ariaLabel={t.notation}
            className="w-full"
          />
        </div>
      </Stage>
    </GameShell>
  );
}
