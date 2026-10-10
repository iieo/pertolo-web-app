'use client';

import { BackLink } from '@/components/game/back-link';
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
import { LEVELS, type Level } from '../rhythm';
import {
  effectiveMeasures,
  MEASURE_OPTIONS,
  type Measures,
  MODES,
  QUIZ_MEASURE_OPTIONS,
  QUIZ_ROUNDS,
  type Settings,
  type Tempo,
  TEMPOS,
  updateSettings,
} from '../settings';

function numberOptions<T extends number>(values: readonly T[]) {
  return values.map((value) => ({ value: String(value), label: String(value) }));
}

const LEVEL_OPTIONS = numberOptions(LEVELS);
const TEMPO_OPTIONS = numberOptions(TEMPOS);

export function SetupPhase({
  settings,
  audioSupported,
  locale,
  setLocale,
  t,
  onStart,
}: {
  settings: Settings;
  audioSupported: boolean;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  onStart: () => void;
}) {
  const quiz = settings.mode === 'quiz';
  const metronomeOptions = [
    { value: 'on', label: t.on },
    { value: 'off', label: t.off },
  ] as const;

  return (
    <SetupScreen
      title={t.title}
      subtitle={t.subtitle}
      back={<BackLink locale={locale} />}
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
          <SegmentedControl
            label={t.level}
            description={t.levels[settings.level]}
            value={String(settings.level)}
            options={LEVEL_OPTIONS}
            onChange={(value) => updateSettings({ level: Number(value) as Level })}
          />
          <SegmentedControl
            label={t.tempo}
            description={t.tempoDescription}
            value={String(settings.tempo)}
            options={TEMPO_OPTIONS}
            onChange={(value) => updateSettings({ tempo: Number(value) as Tempo })}
          />
          <SegmentedControl
            label={t.measures}
            description={quiz ? t.quizMeasures : undefined}
            value={String(effectiveMeasures(settings))}
            options={numberOptions(quiz ? QUIZ_MEASURE_OPTIONS : MEASURE_OPTIONS)}
            onChange={(value) => updateSettings({ measures: Number(value) as Measures })}
          />
          <SegmentedControl
            label={t.metronome}
            value={settings.metronome ? 'on' : 'off'}
            options={metronomeOptions}
            onChange={(value) => updateSettings({ metronome: value === 'on' })}
          />
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.start}
          detail={
            !audioSupported
              ? t.audioUnsupported
              : quiz
                ? t.quizDetail(QUIZ_ROUNDS)
                : t.startDetail(settings.level, settings.tempo)
          }
          disabled={!audioSupported}
          onClick={onStart}
        />
      }
    >
      <section aria-label={t.modesLabel} className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {MODES.map((mode) => (
          <CategoryTile
            key={mode}
            featured
            name={t.modes[mode].name}
            description={t.modes[mode].description}
            color={modeColor(mode)}
            selected={settings.mode === mode}
            onClick={() => updateSettings({ mode })}
          />
        ))}
      </section>
    </SetupScreen>
  );
}
