'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  countByCategory as countCategories,
  useCategorySelection,
} from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';

import { MIXED_CATEGORIES, RoundLength } from './categories';
import { requestTiltPermission } from './device';
import { DICTIONARIES, Dictionary } from './i18n';
import { CategoryKey, GamePhase, RoundResult, Word } from './types';

const { useLocale, setLocale } = createLocaleStore('heads-up-locale');

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
  mixedCount: number;
  availableCount: number;
  roundLength: RoundLength;
  setRoundLength: (length: RoundLength) => void;
  tiltEnabled: boolean;
  currentWord: string | null;
  wordNumber: number;
  results: RoundResult[];
  startGame: () => void;
  beginRound: () => void;
  startPlaying: () => void;
  markWord: (correct: boolean) => void;
  finishRound: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useHeadsUpGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useHeadsUpGame must be used within a GameProvider');
  }
  return context;
};

// Mixed or multiple categories can contain the same German word more than once.
function dedupe(words: Word[]): Word[] {
  const seen = new Set<string>();
  return words.filter((w) => {
    const key = w.word.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function reshuffle(pool: Word[], previous: Word | undefined): Word[] {
  const deck = shuffle(pool);
  if (deck.length > 1 && previous && deck[0]!.id === previous.id) {
    [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1]!, deck[0]!];
  }
  return deck;
}

type Deck = { pool: Word[]; cards: Word[]; cursor: number };

const EMPTY_DECK: Deck = { pool: [], cards: [], cursor: 0 };

export const GameProvider = ({ children, words }: { children: React.ReactNode; words: Word[] }) => {
  const locale = useLocale();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const {
    mixed,
    selected: selectedCategories,
    active: activeCategories,
    selectMixed,
    toggle: toggleCategory,
  } = useCategorySelection(MIXED_CATEGORIES);
  const [roundLength, setRoundLength] = useState<RoundLength>(60);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [deck, setDeck] = useState<Deck>(EMPTY_DECK);
  const [wordNumber, setWordNumber] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);

  const countByCategory = useMemo(() => countCategories(words), [words]);

  const mixedCount = useMemo(
    () => dedupe(words.filter((w) => MIXED_CATEGORIES.includes(w.category))).length,
    [words],
  );

  const pool = useMemo(
    () => dedupe(words.filter((w) => activeCategories.includes(w.category))),
    [words, activeCategories],
  );

  const startGame = useCallback(() => {
    if (pool.length === 0) return;
    requestTiltPermission().then(setTiltEnabled);
    setDeck({ pool, cards: shuffle(pool), cursor: 0 });
    setResults([]);
    setPhase('ready');
  }, [pool]);

  const advance = useCallback(() => {
    setDeck((d) => {
      if (d.cursor + 1 < d.cards.length) return { ...d, cursor: d.cursor + 1 };
      return { ...d, cards: reshuffle(d.pool, d.cards[d.cursor]), cursor: 0 };
    });
    setWordNumber((n) => n + 1);
  }, []);

  const beginRound = useCallback(() => {
    setResults([]);
    setPhase('countdown');
  }, []);

  const startPlaying = useCallback(() => setPhase('playing'), []);

  const current = deck.cards[deck.cursor];

  const markWord = useCallback(
    (correct: boolean) => {
      if (!current) return;
      setResults((prev) => [...prev, { word: current, correct }]);
      advance();
    },
    [current, advance],
  );

  // The word on screen when time runs out is skipped, so nobody gets it again right away.
  const finishRound = useCallback(() => {
    advance();
    setPhase('result');
  }, [advance]);

  const backToSetup = useCallback(() => {
    setDeck(EMPTY_DECK);
    setResults([]);
    setPhase('setup');
  }, []);

  const currentWord = current ? (locale === 'en' ? current.wordEn : current.word) : null;

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
        mixedCount,
        availableCount: pool.length,
        roundLength,
        setRoundLength,
        tiltEnabled,
        currentWord,
        wordNumber,
        results,
        startGame,
        beginRound,
        startPlaying,
        markWord,
        finishRound,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
