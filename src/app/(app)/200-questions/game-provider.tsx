'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  countByCategory as countCategories,
  sumCounts,
  useCategorySelection,
} from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';

import { MAX_QUESTIONS, MIXED_CATEGORIES } from './categories';
import { DICTIONARIES, Dictionary } from './i18n';
import { CategoryKey, GamePhase, Question } from './types';

const { useLocale, setLocale } = createLocaleStore('200q-locale');

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
  deck: Question[];
  currentIndex: number;
  currentQuestion: Question | null;
  currentQuestionText: string | null;
  isLastQuestion: boolean;
  startGame: () => void;
  nextQuestion: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useTwoHundredQuestionsGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useTwoHundredQuestionsGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({
  children,
  questions,
}: {
  children: React.ReactNode;
  questions: Question[];
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
  const [deck, setDeck] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const countByCategory = useMemo(() => countCategories(questions), [questions]);

  const availableCount = sumCounts(countByCategory, activeCategories);

  const startGame = useCallback(() => {
    const pool = questions.filter((q) => activeCategories.includes(q.category));
    if (pool.length === 0) return;
    setDeck(shuffle(pool).slice(0, MAX_QUESTIONS));
    setCurrentIndex(0);
    setPhase('question');
  }, [questions, activeCategories]);

  const nextQuestion = useCallback(() => {
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

  const currentQuestion = deck[currentIndex] ?? null;
  const currentQuestionText = currentQuestion
    ? locale === 'en'
      ? (currentQuestion.questionEn ?? currentQuestion.question)
      : currentQuestion.question
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
        currentQuestion,
        currentQuestionText,
        isLastQuestion: currentIndex === deck.length - 1,
        startGame,
        nextQuestion,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
