'use client';

import { useEffect } from 'react';

import { BackLink } from '@/components/game/back-link';
import { focusRingClass } from '@/components/game/page-shell';
import {
  CategoryGrid,
  LanguageToggle,
  RulesLink,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';
import { cn } from '@/lib/utils';

import { useDrinkGame } from '../game-provider';
import { categoryColor } from '../palette';
import { MIN_PLAYERS } from '../players';

export function CategoryPhase() {
  const {
    players,
    categories,
    loadError,
    mixed,
    selectMixed,
    selectedCategories,
    toggleCategory,
    countFor,
    mixedCount,
    availableCount,
    starting,
    startError,
    startGame,
    goToPlayers,
    locale,
    setLocale,
    t,
  } = useDrinkGame();

  const tooFewPlayers = players !== null && players.length < MIN_PLAYERS;

  useEffect(() => {
    if (tooFewPlayers) goToPlayers();
  }, [tooFewPlayers, goToPlayers]);

  if (players === null || tooFewPlayers) return null;

  const names = new Intl.ListFormat(locale, { type: 'conjunction' }).format(players);
  const error = loadError ? t.loadErrors[loadError] : startError ? t.startErrors[startError] : null;

  return (
    <SetupScreen
      title={t.title}
      subtitle={t.withPlayers(names)}
      back={<BackLink locale={locale} />}
      rules={
        <div className="flex flex-wrap items-center gap-x-4">
          <RulesLink
            label={t.rules}
            title={t.rulesTitle}
            rules={t.rulesList}
            confirmLabel={t.rulesConfirm}
            lang={locale}
          />
          <button
            type="button"
            onClick={goToPlayers}
            className={cn(
              'flex min-h-11 items-center rounded-lg px-2 text-base font-medium text-white/60 hover:text-white md:text-lg',
              focusRingClass,
            )}
          >
            {t.editPlayers}
          </button>
        </div>
      }
      settings={
        <SettingsSection>
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <div className="flex flex-col gap-4">
          {error && (
            <p role="alert" className="text-base leading-relaxed text-red-300">
              {error}
            </p>
          )}
          <StartButton
            label={starting ? t.loading : t.start}
            detail={availableCount === 0 ? t.selectAtLeastOne : t.tasksPerRound(availableCount)}
            disabled={availableCount === 0 || starting}
            onClick={() => startGame()}
          />
        </div>
      }
    >
      {categories.length > 0 && (
        <CategoryGrid
          label={t.categoriesLabel}
          mixed={{
            name: t.mixed.name,
            description: t.mixed.description,
            count: t.taskCount(mixedCount),
            color: categoryColor('mixed'),
          }}
          mixedSelected={mixed}
          onSelectMixed={selectMixed}
          individuallyLabel={t.chooseIndividually}
          categories={categories.map((category) => ({
            key: category.key,
            name: t.categories[category.key].name,
            description: t.categories[category.key].description,
            count: t.taskCount(countFor(category)),
            color: categoryColor(category.key),
          }))}
          selected={selectedCategories}
          onToggle={toggleCategory}
        />
      )}
    </SetupScreen>
  );
}
