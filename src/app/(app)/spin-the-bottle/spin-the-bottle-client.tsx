'use client';

import { useEffect, useState } from 'react';

import { createLocaleStore } from '@/components/game/locale';

import { BottleMode } from './components/bottle-mode';
import { FingerPicker } from './components/finger-picker';
import { SetupPhase } from './components/setup-phase';
import { DICTIONARIES } from './i18n';
import type { Mode, PickerSplit } from './types';

const { useLocale, setLocale } = createLocaleStore('spin-the-bottle-locale');

export function SpinTheBottleClient() {
  const locale = useLocale();
  const t = DICTIONARIES[locale];
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>('bottle');
  const [split, setSplit] = useState<PickerSplit>('winner');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playing]);

  const quit = () => setPlaying(false);

  return (
    <div lang={locale}>
      {!playing ? (
        <SetupPhase
          t={t}
          locale={locale}
          setLocale={setLocale}
          mode={mode}
          setMode={setMode}
          split={split}
          setSplit={setSplit}
          onStart={() => setPlaying(true)}
        />
      ) : mode === 'bottle' ? (
        <BottleMode t={t} locale={locale} onQuit={quit} />
      ) : (
        <FingerPicker t={t} locale={locale} split={split} onQuit={quit} />
      )}
    </div>
  );
}
