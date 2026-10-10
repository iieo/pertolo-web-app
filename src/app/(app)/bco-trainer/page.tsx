'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import abcjs from 'abcjs';
import type { Difficulty, ExtendedSynthObjectController } from './types';
import { generateRhythmPattern, buildSheet } from './utils';
import { Header } from './components/header';
import { SheetMusicCard } from './components/sheet-music-card';
import { SettingsPanel } from './settings-panel';
import { ActionButtons } from './components/action-buttons';

export default function BCOTrainerPage() {
  const [isPaperVisible, setIsPaperVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [tempo, setTempo] = useState(75);
  const [measures, setMeasures] = useState(2);

  const paperRef = useRef<HTMLDivElement>(null);
  const visualObjRef = useRef<abcjs.TuneObject | null>(null);
  const midiBufferRef = useRef<ExtendedSynthObjectController | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const patternRef = useRef<string>('');

  const generateNewPattern = useCallback(() => {
    patternRef.current = generateRhythmPattern(difficulty, measures);
  }, [difficulty, measures]);

  const renderSheet = useCallback(() => {
    if (!paperRef.current || !patternRef.current) return;

    const sheet = buildSheet(patternRef.current, tempo);
    const result = abcjs.renderAbc(paperRef.current, sheet, {
      responsive: 'resize',
    });

    visualObjRef.current = result[0] ?? null;
  }, [tempo]);

  useEffect(() => {
    generateNewPattern();
  }, [generateNewPattern]);

  useEffect(() => {
    renderSheet();
  }, [renderSheet, patternRef.current]);

  const handlePlay = async () => {
    if (!visualObjRef.current) return;

    if (!abcjs.synth.supportsAudio()) {
      setAudioError(true);
      return;
    }

    try {
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Unlock audio context for mobile browsers (iOS Safari)
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0;
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(0);
        oscillator.stop(ctx.currentTime + 0.1);
      }

      await audioContextRef.current.resume();

      const synth = new abcjs.synth.CreateSynth() as unknown as ExtendedSynthObjectController;

      await synth.init({
        visualObj: visualObjRef.current,
        audioContext: audioContextRef.current,
        millisecondsPerMeasure: visualObjRef.current.millisecondsPerMeasure(),
      });

      await synth.prime();
      synth.start();

      midiBufferRef.current = synth;
      setIsPlaying(true);
    } catch (error) {
      console.warn('synth error', error);
      if ((error as { status?: string })?.status === 'NotSupported') {
        setAudioError(true);
      }
    }
  };

  const handleStop = () => {
    if (midiBufferRef.current) {
      midiBufferRef.current.stop();
    }
    setIsPlaying(false);
  };

  const handleToggleVisibility = () => {
    setIsPaperVisible(!isPaperVisible);
  };

  const handleReload = () => {
    handleStop();
    setIsPaperVisible(false);
    generateNewPattern();
    renderSheet();
  };

  return (
    <div className="min-h-dvh w-full bg-black pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] text-white sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))]">
      <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))] sm:gap-12 lg:pb-24">
        <Header />

        <div className="flex flex-col gap-4">
          <SheetMusicCard
            ref={paperRef}
            isPlaying={isPlaying}
            isPaperVisible={isPaperVisible}
            measures={measures}
            tempo={tempo}
          />

          <ActionButtons
            isPlaying={isPlaying}
            isPaperVisible={isPaperVisible}
            onPlay={handlePlay}
            onStop={handleStop}
            onToggleVisibility={handleToggleVisibility}
            onReload={handleReload}
          />

          {audioError && (
            <p role="alert" className="text-base text-white">
              Audio is not supported in this browser.
            </p>
          )}
        </div>

        <SettingsPanel
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          tempo={tempo}
          setTempo={setTempo}
          measures={measures}
          setMeasures={setMeasures}
          isPlaying={isPlaying}
        />

        <p className="mt-auto pt-8 text-sm text-white/60">By Lars &amp; Leo</p>
      </main>
    </div>
  );
}
