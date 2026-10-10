'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { voteWouldYouRather } from './actions';
import { MAX_QUESTIONS, MIXED_CATEGORIES } from './categories';
import { DICTIONARIES, Dictionary, Locale } from './i18n';
import { setLocale, useLocale } from './locale';
import { CategoryKey, Choice, GamePhase, Question, Votes } from './types';

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
  currentOptions: { a: string; b: string } | null;
  choice: Choice | null;
  votes: Votes | null;
  isLastQuestion: boolean;
  startGame: () => void;
  choose: (choice: Choice) => void;
  nextQuestion: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useWouldYouRatherGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useWouldYouRatherGame must be used within a GameProvider');
  }
  return context;
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

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
  const [deck, setDeck] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [votes, setVotes] = useState<Votes | null>(null);
  // Guards against a late server response overwriting the counts of a newer question.
  const voteRequest = useRef(0);

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

  const resetVote = useCallback(() => {
    voteRequest.current += 1;
    setChoice(null);
    setVotes(null);
  }, []);

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
    resetVote();
    setDeck(shuffle(pool).slice(0, MAX_QUESTIONS));
    setCurrentIndex(0);
    setPhase('question');
  }, [questions, activeCategories, resetVote]);

  const currentQuestion = deck[currentIndex] ?? null;

  const choose = useCallback(
    (picked: Choice) => {
      if (!currentQuestion || choice) return;
      const request = ++voteRequest.current;
      setChoice(picked);
      setVotes({
        votesA: currentQuestion.votesA + (picked === 'a' ? 1 : 0),
        votesB: currentQuestion.votesB + (picked === 'b' ? 1 : 0),
      });
      voteWouldYouRather(currentQuestion.id, picked)
        .then((result) => {
          if (result.success && voteRequest.current === request) setVotes(result.data);
        })
        .catch(() => {});
    },
    [currentQuestion, choice],
  );

  const nextQuestion = useCallback(() => {
    resetVote();
    if (currentIndex + 1 >= deck.length) {
      setPhase('end');
      return;
    }
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, deck.length, resetVote]);

  const backToSetup = useCallback(() => {
    resetVote();
    setDeck([]);
    setCurrentIndex(0);
    setPhase('setup');
  }, [resetVote]);

  const currentOptions = currentQuestion
    ? locale === 'en'
      ? { a: capitalize(currentQuestion.optionAEn), b: capitalize(currentQuestion.optionBEn) }
      : { a: capitalize(currentQuestion.optionA), b: capitalize(currentQuestion.optionB) }
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
        currentOptions,
        choice,
        votes,
        isLastQuestion: currentIndex === deck.length - 1,
        startGame,
        choose,
        nextQuestion,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
