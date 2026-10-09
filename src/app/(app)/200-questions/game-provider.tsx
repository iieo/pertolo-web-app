'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { MAX_QUESTIONS, MIXED_CATEGORIES } from './categories';
import { DICTIONARIES, Dictionary, Locale } from './i18n';
import { setLocale, useLocale } from './locale';
import { CategoryKey, GamePhase, Question } from './types';

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
  drinkEnabled: boolean;
  setDrinkEnabled: (enabled: boolean) => void;
  deck: Question[];
  currentIndex: number;
  currentQuestion: Question | null;
  currentQuestionText: string | null;
  isLastQuestion: boolean;
  startGame: () => void;
  passOn: () => void;
  reveal: () => void;
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

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export const GameProvider = ({
  children,
  questions,
}: {
  children: React.ReactNode;
  questions: Question[];
}) => {
  const locale = useLocale();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [mixed, setMixed] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [drinkEnabled, setDrinkEnabled] = useState(true);
  const [deck, setDeck] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const countByCategory = useMemo(() => {
    const counts = {} as Record<CategoryKey, number>;
    for (const q of questions) counts[q.category] = (counts[q.category] ?? 0) + 1;
    return counts;
  }, [questions]);

  const activeCategories = mixed ? MIXED_CATEGORIES : selectedCategories;

  const availableCount = activeCategories.reduce(
    (sum, key) => sum + (countByCategory[key] ?? 0),
    0,
  );

  const selectMixed = useCallback(() => {
    setMixed(true);
    setSelectedCategories([]);
  }, []);

  const toggleCategory = useCallback(
    (key: CategoryKey) => {
      if (mixed) {
        setMixed(false);
        setSelectedCategories([key]);
        return;
      }
      setSelectedCategories((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      );
    },
    [mixed],
  );

  const startGame = useCallback(() => {
    const pool = questions.filter((q) => activeCategories.includes(q.category));
    if (pool.length === 0) return;
    setDeck(shuffle(pool).slice(0, MAX_QUESTIONS));
    setCurrentIndex(0);
    setPhase('read');
  }, [questions, activeCategories]);

  const passOn = useCallback(() => setPhase('handover'), []);
  const reveal = useCallback(() => setPhase('reveal'), []);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= deck.length) {
      setPhase('end');
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setPhase('read');
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
        drinkEnabled,
        setDrinkEnabled,
        deck,
        currentIndex,
        currentQuestion,
        currentQuestionText,
        isLastQuestion: currentIndex === deck.length - 1,
        startGame,
        passOn,
        reveal,
        nextQuestion,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
