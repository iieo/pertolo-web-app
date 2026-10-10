'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import {
  countByCategory as countCategories,
  sumCounts,
  useCategorySelection,
} from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';

import { voteHotTake } from './actions';
import { MAX_TAKES, MIXED_CATEGORIES } from './categories';
import { DICTIONARIES, Dictionary } from './i18n';
import { CategoryKey, Choice, GamePhase, Take, Votes } from './types';

const { useLocale, setLocale } = createLocaleStore('hot-takes-locale');

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
  deck: Take[];
  currentIndex: number;
  currentStatement: string | null;
  choice: Choice | null;
  votes: Votes | null;
  isLastTake: boolean;
  startGame: () => void;
  choose: (choice: Choice) => void;
  nextTake: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useHotTakesGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useHotTakesGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children, takes }: { children: React.ReactNode; takes: Take[] }) => {
  const locale = useLocale();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const {
    mixed,
    selected: selectedCategories,
    active: activeCategories,
    selectMixed,
    toggle: toggleCategory,
  } = useCategorySelection(MIXED_CATEGORIES);
  const [deck, setDeck] = useState<Take[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [votes, setVotes] = useState<Votes | null>(null);
  // Guards against a late server response overwriting the counts of a newer statement.
  const voteRequest = useRef(0);

  const countByCategory = useMemo(() => countCategories(takes), [takes]);

  const availableCount = sumCounts(countByCategory, activeCategories);

  const resetVote = useCallback(() => {
    voteRequest.current += 1;
    setChoice(null);
    setVotes(null);
  }, []);

  const startGame = useCallback(() => {
    const pool = takes.filter((take) => activeCategories.includes(take.category));
    if (pool.length === 0) return;
    resetVote();
    setDeck(shuffle(pool).slice(0, MAX_TAKES));
    setCurrentIndex(0);
    setPhase('question');
  }, [takes, activeCategories, resetVote]);

  const currentTake = deck[currentIndex] ?? null;

  const choose = useCallback(
    (picked: Choice) => {
      if (!currentTake || choice) return;
      const request = ++voteRequest.current;
      setChoice(picked);
      setVotes({
        votesAgree: currentTake.votesAgree + (picked === 'agree' ? 1 : 0),
        votesDisagree: currentTake.votesDisagree + (picked === 'disagree' ? 1 : 0),
      });
      voteHotTake(currentTake.id, picked)
        .then((result) => {
          if (result.success && voteRequest.current === request) setVotes(result.data);
        })
        .catch(() => {});
    },
    [currentTake, choice],
  );

  const nextTake = useCallback(() => {
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

  const currentStatement = currentTake
    ? locale === 'en'
      ? currentTake.statementEn
      : currentTake.statement
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
        currentStatement,
        choice,
        votes,
        isLastTake: currentIndex === deck.length - 1,
        startGame,
        choose,
        nextTake,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
