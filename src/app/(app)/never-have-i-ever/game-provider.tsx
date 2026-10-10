'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  countByCategory as countCategories,
  sumCounts,
  useCategorySelection,
} from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';

import { MAX_STATEMENTS, MIXED_CATEGORIES } from './categories';
import { DICTIONARIES, Dictionary } from './i18n';
import { CategoryKey, GamePhase, Statement } from './types';

const { useLocale, setLocale } = createLocaleStore('never-have-i-ever-locale');

type GameContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  phase: GamePhase;
  mixed: boolean;
  selectMixed: () => void;
  selectedCategories: CategoryKey[];
  toggleCategory: (key: CategoryKey) => void;
  countByCategory: Record<CategoryKey, number>;
  availableCount: number;
  deck: Statement[];
  currentIndex: number;
  currentStatementText: string | null;
  isLastStatement: boolean;
  startGame: () => void;
  nextStatement: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useNeverHaveIEverGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useNeverHaveIEverGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({
  children,
  statements,
}: {
  children: React.ReactNode;
  statements: Statement[];
}) => {
  const locale = useLocale();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const {
    mixed,
    selected: selectedCategories,
    active: activeCategories,
    selectMixed,
    toggle: toggleCategory,
  } = useCategorySelection(MIXED_CATEGORIES);
  const [deck, setDeck] = useState<Statement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const countByCategory = useMemo(() => countCategories(statements), [statements]);

  const availableCount = sumCounts(countByCategory, activeCategories);

  const startGame = useCallback(() => {
    const pool = statements.filter((s) => activeCategories.includes(s.category));
    if (pool.length === 0) return;
    setDeck(shuffle(pool).slice(0, MAX_STATEMENTS));
    setCurrentIndex(0);
    setPhase('statement');
  }, [statements, activeCategories]);

  const nextStatement = useCallback(() => {
    if (currentIndex + 1 >= deck.length) {
      setPhase('end');
      return;
    }
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, deck.length]);

  const backToSetup = useCallback(() => {
    setDeck([]);
    setCurrentIndex(0);
    setPhase('setup');
  }, []);

  const current = deck[currentIndex] ?? null;
  const currentStatementText = current
    ? locale === 'en'
      ? current.statementEn
      : current.statement
    : null;

  return (
    <GameContext.Provider
      value={{
        locale,
        setLocale,
        t: DICTIONARIES[locale],
        phase,
        mixed,
        selectMixed,
        selectedCategories,
        toggleCategory,
        countByCategory,
        availableCount,
        deck,
        currentIndex,
        currentStatementText,
        isLastStatement: currentIndex === deck.length - 1,
        startGame,
        nextStatement,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
