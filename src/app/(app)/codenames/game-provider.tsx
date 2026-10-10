'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  countByCategory as countCategories,
  useCategorySelection,
} from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';

import { BOARD_SIZE, boardRoles, MIXED_CATEGORIES, otherTeam } from './categories';
import { DICTIONARIES, Dictionary } from './i18n';
import { Card, CategoryKey, EndReason, GamePhase, Team, Word } from './types';

const { useLocale, setLocale } = createLocaleStore('codenames-locale');

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
  cards: Card[];
  turn: Team;
  armedIndex: number | null;
  winner: Team | null;
  endReason: EndReason | null;
  startGame: () => void;
  tapCard: (index: number) => void;
  endTurn: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useCodenamesGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useCodenamesGame must be used within a GameProvider');
  }
  return context;
};

export function displayWord(card: { word: string; wordEn: string }, locale: Locale) {
  return locale === 'en' ? card.wordEn : card.word;
}

// The same word can exist in several categories, so cards are unique by the shown text.
function uniqueByDisplay(words: Word[], locale: Locale) {
  const seen = new Set<string>();
  return words.filter((word) => {
    const key = displayWord(word, locale).trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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
  const [cards, setCards] = useState<Card[]>([]);
  const [turn, setTurn] = useState<Team>('red');
  const [armedIndex, setArmedIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<Team | null>(null);
  const [endReason, setEndReason] = useState<EndReason | null>(null);

  const countByCategory = useMemo(() => countCategories(words), [words]);

  const pool = useMemo(
    () =>
      uniqueByDisplay(
        words.filter((word) => activeCategories.includes(word.category)),
        locale,
      ),
    [words, activeCategories, locale],
  );

  const startGame = useCallback(() => {
    if (pool.length < BOARD_SIZE) return;
    const startingTeam: Team = Math.random() < 0.5 ? 'red' : 'blue';
    const roles = shuffle(boardRoles(startingTeam));
    const drawn = shuffle(pool).slice(0, BOARD_SIZE);
    setCards(
      drawn.map((word, index) => ({
        id: word.id,
        word: word.word,
        wordEn: word.wordEn,
        role: roles[index]!,
        revealed: false,
      })),
    );
    setTurn(startingTeam);
    setArmedIndex(null);
    setWinner(null);
    setEndReason(null);
    setPhase('playing');
  }, [pool]);

  const finish = useCallback((team: Team, reason: EndReason) => {
    setWinner(team);
    setEndReason(reason);
    setArmedIndex(null);
    setPhase('end');
  }, []);

  const tapCard = useCallback(
    (index: number) => {
      const card = cards[index];
      if (!card || card.revealed) return;
      if (armedIndex !== index) {
        setArmedIndex(index);
        return;
      }

      const next = cards.map((c, i) => (i === index ? { ...c, revealed: true } : c));
      setCards(next);
      setArmedIndex(null);

      if (card.role === 'assassin') {
        finish(otherTeam(turn), 'assassin');
        return;
      }
      if (card.role === 'red' || card.role === 'blue') {
        const team = card.role;
        if (next.every((c) => c.role !== team || c.revealed)) {
          finish(team, 'allFound');
          return;
        }
      }
      if (card.role !== turn) setTurn(otherTeam(turn));
    },
    [cards, armedIndex, turn, finish],
  );

  const endTurn = useCallback(() => {
    setArmedIndex(null);
    setTurn((current) => otherTeam(current));
  }, []);

  const backToSetup = useCallback(() => {
    setCards([]);
    setArmedIndex(null);
    setWinner(null);
    setEndReason(null);
    setPhase('setup');
  }, []);

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
        availableCount: pool.length,
        cards,
        turn,
        armedIndex,
        winner,
        endReason,
        startGame,
        tapCard,
        endTurn,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
