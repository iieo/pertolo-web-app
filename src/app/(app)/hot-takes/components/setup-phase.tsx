'use client';

import { BackLink } from '@/components/game/back-link';
import { sumCounts } from '@/components/game/category-selection';
import {
  CategoryGrid,
  LanguageToggle,
  RulesLink,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';

import { CATEGORY_KEYS, MAX_TAKES, MIXED_CATEGORIES } from '../categories';
import { useHotTakesGame } from '../game-provider';
import { categoryColor } from '../palette';

export function SetupPhase() {
  const {
    mixed,
    selectMixed,
    selectedCategories,
    toggleCategory,
    countByCategory,
    availableCount,
    startGame,
    locale,
    setLocale,
    t,
  } = useHotTakesGame();

  const roundSize = Math.min(availableCount, MAX_TAKES);

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
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.start}
          detail={availableCount === 0 ? t.selectAtLeastOne : t.takesPerRound(roundSize)}
          disabled={availableCount === 0}
          onClick={() => {
            startGame();
          }}
        />
      }
    >
      <CategoryGrid
        label={t.categoriesLabel}
        mixed={{
          ...t.mixed,
          count: t.takeCount(sumCounts(countByCategory, MIXED_CATEGORIES)),
          color: categoryColor('mixed'),
        }}
        mixedSelected={mixed}
        onSelectMixed={selectMixed}
        individuallyLabel={t.chooseIndividually}
        categories={CATEGORY_KEYS.map((key) => ({
          key,
          ...t.categories[key],
          count: t.takeCount(countByCategory[key] ?? 0),
          color: categoryColor(key),
        }))}
        selected={selectedCategories}
        onToggle={toggleCategory}
      />
    </SetupScreen>
  );
}
