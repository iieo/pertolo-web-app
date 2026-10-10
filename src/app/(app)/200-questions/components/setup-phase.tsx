'use client';

import { sumCounts } from '@/components/game/category-selection';
import { enterFullscreen } from '@/components/game/fullscreen';
import {
  CategoryGrid,
  LanguageToggle,
  RulesLink,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';

import { CATEGORY_KEYS, MAX_QUESTIONS, MIXED_CATEGORIES } from '../categories';
import { useTwoHundredQuestionsGame } from '../game-provider';
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
  } = useTwoHundredQuestionsGame();

  const roundSize = Math.min(availableCount, MAX_QUESTIONS);

  return (
    <SetupScreen
      title="200 Questions"
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
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.start}
          detail={availableCount === 0 ? t.selectAtLeastOne : t.questionsPerRound(roundSize)}
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
          count: t.questionCount(sumCounts(countByCategory, MIXED_CATEGORIES)),
          color: categoryColor('mixed'),
        }}
        mixedSelected={mixed}
        onSelectMixed={selectMixed}
        individuallyLabel={t.chooseIndividually}
        categories={CATEGORY_KEYS.map((key) => ({
          key,
          ...t.categories[key],
          count: t.questionCount(countByCategory[key] ?? 0),
          color: categoryColor(key),
        }))}
        selected={selectedCategories}
        onToggle={toggleCategory}
      />
    </SetupScreen>
  );
}
