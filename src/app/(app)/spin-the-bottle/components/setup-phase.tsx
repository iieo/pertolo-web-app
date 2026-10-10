'use client';

import { enterFullscreen } from '@/components/game/fullscreen';
import type { Locale } from '@/components/game/locale';
import {
  CategoryTile,
  LanguageToggle,
  RulesLink,
  SegmentedControl,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';

import type { Dictionary } from '../i18n';
import { modeColor } from '../palette';
import { type Mode, MODES, type PickerSplit, PICKER_SPLITS } from '../types';

export function SetupPhase({
  t,
  locale,
  setLocale,
  mode,
  setMode,
  split,
  setSplit,
  onStart,
}: {
  t: Dictionary;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  split: PickerSplit;
  setSplit: (split: PickerSplit) => void;
  onStart: () => void;
}) {
  return (
    <SetupScreen
      title={t.title}
      subtitle={t.subtitle}
      rules={
        <RulesLink
          label={t.rules}
          title={t.rulesTitle}
          rules={t.rulesList}
          confirmLabel={t.rulesConfirm}
          lang={locale}
        />
      }
      settings={
        <SettingsSection>
          {mode === 'picker' && (
            <SegmentedControl
              label={t.teamsLabel}
              description={t.teamsDescription}
              value={split}
              options={PICKER_SPLITS.map((value) => ({ value, label: t.splits[value] }))}
              onChange={setSplit}
            />
          )}
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.start}
          onClick={() => {
            enterFullscreen();
            onStart();
          }}
        />
      }
    >
      <section aria-label={t.modesLabel} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {MODES.map((key) => (
          <CategoryTile
            key={key}
            featured
            name={t.modes[key].name}
            description={t.modes[key].description}
            color={modeColor(key)}
            selected={mode === key}
            onClick={() => setMode(key)}
          />
        ))}
      </section>
    </SetupScreen>
  );
}
