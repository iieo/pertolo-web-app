'use client';

import { BackLink } from '@/components/game/back-link';
import { sumCounts } from '@/components/game/category-selection';
import {
  CategoryGrid,
  LanguageToggle,
  RulesLink,
  SegmentedControl,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';

import {
  CATEGORY_KEYS,
  MIXED_CATEGORIES,
  ROUND_COUNTS,
  type RoundCount,
  TEAM_COUNTS,
  type TeamCount,
} from '../categories';
import { useWavelengthGame } from '../game-provider';
import { categoryColor } from '../palette';

export function SetupPhase() {
  const {
    mixed,
    selectMixed,
    selectedCategories,
    toggleCategory,
    countByCategory,
    availableCount,
    teamCount,
    setTeamCount,
    roundCount,
    setRoundCount,
    startGame,
    locale,
    setLocale,
    t,
  } = useWavelengthGame();

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
            label={t.teams}
            description={t.teamsDescription}
            value={String(teamCount)}
            options={TEAM_COUNTS.map((count) => ({ value: String(count), label: String(count) }))}
            onChange={(value) => setTeamCount(Number(value) as TeamCount)}
          />
          <SegmentedControl
            label={t.rounds}
            value={String(roundCount)}
            options={ROUND_COUNTS.map((count) => ({ value: String(count), label: String(count) }))}
            onChange={(value) => setRoundCount(Number(value) as RoundCount)}
          />
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.start}
          detail={
            availableCount === 0
              ? t.selectAtLeastOne
              : t.roundsDetail(Math.min(availableCount, roundCount))
          }
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
          count: t.spectrumCount(sumCounts(countByCategory, MIXED_CATEGORIES)),
          color: categoryColor('mixed'),
        }}
        mixedSelected={mixed}
        onSelectMixed={selectMixed}
        individuallyLabel={t.chooseIndividually}
        categories={CATEGORY_KEYS.map((key) => ({
          key,
          ...t.categories[key],
          count: t.spectrumCount(countByCategory[key] ?? 0),
          color: categoryColor(key),
        }))}
        selected={selectedCategories}
        onToggle={toggleCategory}
      />
    </SetupScreen>
  );
}
