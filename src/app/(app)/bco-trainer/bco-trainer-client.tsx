'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { EndScreen } from '@/components/game/end-screen';
import { exitFullscreen } from '@/components/game/fullscreen';
import { createLocaleStore } from '@/components/game/locale';

import { isAudioSupported, unlockAudio } from './audio';
import { QuizPhase } from './components/quiz-phase';
import { SetupPhase } from './components/setup-phase';
import { type GameConfig, TrainerPhase } from './components/trainer-phase';
import { DICTIONARIES } from './i18n';
import { effectiveMeasures, useSettings } from './settings';

const { useLocale, setLocale } = createLocaleStore('bco-trainer-locale');

type Phase = 'setup' | 'game' | 'end';

const noopSubscribe = () => () => {};

export function BcoTrainerClient() {
  const locale = useLocale();
  const t = DICTIONARIES[locale];
  const settings = useSettings();
  const audioSupported = useSyncExternalStore(noopSubscribe, isAudioSupported, () => true);
  const [phase, setPhase] = useState<Phase>('setup');
  // Remounts the game on every start, so a new session always begins at round one.
  const [session, setSession] = useState(0);
  const [result, setResult] = useState({ score: 0, total: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  const start = () => {
    if (!isAudioSupported()) return;
    // Has to run first, while the browser still treats this as a user gesture.
    unlockAudio().catch(() => {});
    setSession((s) => s + 1);
    setPhase('game');
  };

  const backToSetup = () => setPhase('setup');

  const config: GameConfig = {
    level: settings.level,
    tempo: settings.tempo,
    measures: effectiveMeasures(settings),
    metronome: settings.metronome,
  };

  return (
    <div lang={locale}>
      {phase === 'setup' && (
        <SetupPhase
          settings={settings}
          audioSupported={audioSupported}
          locale={locale}
          setLocale={setLocale}
          t={t}
          onStart={start}
        />
      )}
      {phase === 'game' &&
        (settings.mode === 'quiz' ? (
          <QuizPhase
            key={session}
            config={config}
            locale={locale}
            t={t}
            onQuit={backToSetup}
            onFinish={(score, total) => {
              setResult({ score, total });
              setPhase('end');
            }}
          />
        ) : (
          <TrainerPhase
            key={session}
            mode={settings.mode}
            config={config}
            locale={locale}
            t={t}
            onQuit={backToSetup}
          />
        ))}
      {phase === 'end' && (
        <EndScreen
          title={t.endTitle}
          detail={t.score(result.score, result.total)}
          playAgainLabel={t.playAgain}
          homeLabel={t.backToSetup}
          onPlayAgain={start}
          onHome={() => {
            exitFullscreen();
            backToSetup();
          }}
        />
      )}
    </div>
  );
}
