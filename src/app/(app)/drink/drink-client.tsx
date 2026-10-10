'use client';

import { useEffect } from 'react';

import { CategoryPhase } from './components/category-phase';
import { EndPhase } from './components/end-phase';
import { PlayersPhase } from './components/players-phase';
import { TaskPhase } from './components/task-phase';
import { GameProvider, useDrinkGame } from './game-provider';
import { DrinkCategory, GamePhase, LoadError } from './types';

function DrinkContent() {
  const { phase, locale } = useDrinkGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  return <div lang={locale}>{renderPhase(phase)}</div>;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case 'players':
      return <PlayersPhase />;
    case 'categories':
      return <CategoryPhase />;
    case 'playing':
      return <TaskPhase />;
    case 'end':
      return <EndPhase />;
  }
}

export function DrinkClient({
  categories,
  loadError,
}: {
  categories: DrinkCategory[];
  loadError: LoadError | null;
}) {
  return (
    <GameProvider categories={categories} loadError={loadError}>
      <DrinkContent />
    </GameProvider>
  );
}
