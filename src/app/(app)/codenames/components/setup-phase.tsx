'use client';

import { BackLink } from '@/components/game/back-link';
import {
  CategoryGrid,
  LanguageToggle,
  RulesLink,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';
import { sumCounts } from '@/components/game/category-selection';

import { BOARD_SIZE, CATEGORY_KEYS, MIXED_CATEGORIES } from '../categories';
import { useCodenamesGame } from '../game-provider';
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
  } = useCodenamesGame();

  const noSelection = !mixed && selectedCategories.length === 0;
  const enough = availableCount >= BOARD_SIZE;

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
          detail={
            noSelection
              ? t.selectAtLeastOne
              : enough
                ? t.wordsPerRound(BOARD_SIZE)
                : t.notEnoughWords(BOARD_SIZE)
          }
          disabled={!enough}
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
          count: t.wordCount(sumCounts(countByCategory, MIXED_CATEGORIES)),
          color: categoryColor('mixed'),
        }}
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
