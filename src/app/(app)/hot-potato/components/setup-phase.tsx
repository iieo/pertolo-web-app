'use client';

import { sumCounts } from '@/components/game/category-selection';
import { enterFullscreen } from '@/components/game/fullscreen';
import {
  CategoryGrid,
  LanguageToggle,
  RulesLink,
  SegmentedControl,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';

import { CATEGORY_KEYS, FUSE_LENGTHS, MAX_PROMPTS, MIXED_CATEGORIES } from '../categories';
import { useHotPotatoGame } from '../game-provider';
import { categoryColor } from '../palette';

export function SetupPhase() {
  const {
    mixed,
    selectMixed,
    selectedCategories,
    toggleCategory,
    countByCategory,
    availableCount,
    fuseLength,
    setFuseLength,
    soundOn,
    setSoundOn,
    startGame,
    locale,
    setLocale,
    t,
  } = useHotPotatoGame();

  const roundSize = Math.min(availableCount, MAX_PROMPTS);

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
          <SegmentedControl
            label={t.fuseLabel}
            value={fuseLength}
            options={FUSE_LENGTHS.map((length) => ({
              value: length,
              label: t.fuseLengths[length],
            }))}
            onChange={setFuseLength}
          />
          <SegmentedControl
            label={t.soundLabel}
            value={soundOn ? 'on' : 'off'}
            options={[
              { value: 'on', label: t.soundOn },
              { value: 'off', label: t.soundOff },
            ]}
            onChange={(value) => setSoundOn(value === 'on')}
          />
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.start}
          detail={availableCount === 0 ? t.selectAtLeastOne : t.promptsPerRound(roundSize)}
          disabled={availableCount === 0}
          onClick={() => {
            enterFullscreen();
            startGame();
          }}
        />
      }
    >
      <CategoryGrid
        label={t.categoriesLabel}
        mixed={{
          ...t.mixed,
          count: t.promptCount(sumCounts(countByCategory, MIXED_CATEGORIES)),
          color: categoryColor('mixed'),
        }}
        mixedSelected={mixed}
        onSelectMixed={selectMixed}
        individuallyLabel={t.chooseIndividually}
        categories={CATEGORY_KEYS.map((key) => ({
          key,
          ...t.categories[key],
          count: t.promptCount(countByCategory[key] ?? 0),
          color: categoryColor(key),
        }))}
        selected={selectedCategories}
        onToggle={toggleCategory}
      />
    </SetupScreen>
  );
}
