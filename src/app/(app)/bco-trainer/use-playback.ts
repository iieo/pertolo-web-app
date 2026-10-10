'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { isAudioSupported, playRhythm, stopAll } from './audio';
import type { Rhythm } from './rhythm';

type PlaybackState = { playing: boolean; beat: number | null; activeIndex: number | null };

const IDLE: PlaybackState = { playing: false, beat: null, activeIndex: null };

/**
 * Wraps playRhythm so the UI never keeps a stale state: every play or stop gets a new token and
 * callbacks from an older playback are ignored. `version` changes on every play and stop, which
 * makes it usable as a tap guard key.
 */
export function usePlayback({ tempo, metronome }: { tempo: number; metronome: boolean }) {
  const [state, setState] = useState<PlaybackState>(IDLE);
  const [version, setVersion] = useState(0);
  const token = useRef(0);
  const stopCurrent = useRef<(() => void) | null>(null);
  const beatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBeatTimer = () => {
    if (beatTimer.current) clearTimeout(beatTimer.current);
    beatTimer.current = null;
  };

  const halt = useCallback(() => {
    token.current += 1;
    clearBeatTimer();
    stopCurrent.current?.();
    stopCurrent.current = null;
    stopAll();
  }, []);

  const stop = useCallback(() => {
    halt();
    setState(IDLE);
    setVersion((v) => v + 1);
  }, [halt]);

  const play = useCallback(
    (rhythm: Rhythm) => {
      halt();
      // playRhythm is a no-op without audio support and onEnd would never fire.
      if (!isAudioSupported()) return;
      const current = token.current;
      const isCurrent = () => token.current === current;
      const beatMs = 60000 / tempo;

      setState({ playing: true, beat: null, activeIndex: null });
      setVersion((v) => v + 1);

      stopCurrent.current = playRhythm(rhythm, {
        tempo,
        metronome,
        countIn: true,
        onCountIn: (beat) => {
          if (!isCurrent()) return;
          setState((s) => ({ ...s, beat }));
          // The last count-in number disappears after one beat, even if the rhythm opens with a rest.
          clearBeatTimer();
          beatTimer.current = setTimeout(() => {
            if (isCurrent()) setState((s) => ({ ...s, beat: null }));
          }, beatMs);
        },
        onNote: (index) => {
          if (!isCurrent()) return;
          setState((s) => ({ ...s, activeIndex: index, beat: index === null ? s.beat : null }));
        },
        onEnd: () => {
          if (!isCurrent()) return;
          clearBeatTimer();
          stopCurrent.current = null;
          setState(IDLE);
        },
      });
    },
    [tempo, metronome, halt],
  );

  useEffect(() => halt, [halt]);

  // The engine stops on its own when the tab hides, without calling onEnd.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) stop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [stop]);

  return { ...state, version, play, stop };
}
