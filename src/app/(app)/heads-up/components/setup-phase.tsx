'use client';

import { BackLink } from '@/components/game/back-link';
import {
  CategoryGrid,
  LanguageToggle,
  RulesLink,
  SegmentedControl,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';

import { CATEGORY_KEYS, ROUND_LENGTHS, type RoundLength } from '../categories';
import { useHeadsUpGame } from '../game-provider';
import { categoryColor } from '../palette';

export function SetupPhase() {
  const {
    mixed,
    selectMixed,
    selectedCategories,
    toggleCategory,
    countByCategory,
    mixedCount,
    availableCount,
    roundLength,
    setRoundLength,
    startGame,
    locale,
    setLocale,
    t,
  } = useHeadsUpGame();

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
            label={t.roundLength}
            value={String(roundLength)}
            options={ROUND_LENGTHS.map((length) => ({
              value: String(length),
              label: t.secondsShort(length),
            }))}
            onChange={(value) => setRoundLength(Number(value) as RoundLength)}
          />
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.start}
          detail={availableCount === 0 ? t.selectAtLeastOne : t.wordCount(availableCount)}
          disabled={availableCount === 0}
          onClick={() => {
            // Permission first: iOS only shows its prompt while the tap still counts as a gesture.
            startGame();
          }}
        />
      }
    >
      <CategoryGrid
        label={t.categoriesLabel}
        mixed={{ ...t.mixed, count: t.wordCount(mixedCount), color: categoryColor('mixed') }}
        mixedSelected={mixed}
        onSelectMixed={selectMixed}
        individuallyLabel={t.chooseIndividually}
        categories={CATEGORY_KEYS.map((key) => ({
          key,
          ...t.categories[key],
          count: t.wordCount(countByCategory[key] ?? 0),
          color: categoryColor(key),
        }))}
        selected={selectedCategories}
        onToggle={toggleCategory}
      />
    </SetupScreen>
  );
}
