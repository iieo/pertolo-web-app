'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  countByCategory as countCategories,
  sumCounts,
  useCategorySelection,
} from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';

import { MIXED_CATEGORIES, RoundCount, TeamCount } from './categories';
import { DICTIONARIES, Dictionary } from './i18n';
import { randomTarget, scoreFor } from './scoring';
import { CategoryKey, GamePhase, Round, Spectrum, TeamIndex } from './types';

const { useLocale, setLocale } = createLocaleStore('wavelength-locale');

const START_NEEDLE = 50;

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
  teamCount: TeamCount;
  setTeamCount: (count: TeamCount) => void;
  roundCount: RoundCount;
  setRoundCount: (count: RoundCount) => void;
  rounds: Round[];
  currentIndex: number;
  currentRound: Round | null;
  left: string;
  right: string;
  targetVisible: boolean;
  needle: number;
  setNeedle: (value: number) => void;
  lastPoints: number;
  scores: [number, number];
  isLastRound: boolean;
  startGame: () => void;
  showTarget: () => void;
  hideTarget: () => void;
  reveal: () => void;
  nextRound: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useWavelengthGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useWavelengthGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({
  children,
  spectrums,
}: {
  children: React.ReactNode;
  spectrums: Spectrum[];
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
  const [teamCount, setTeamCount] = useState<TeamCount>(1);
  const [roundCount, setRoundCount] = useState<RoundCount>(10);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetVisible, setTargetVisible] = useState(false);
  const [needle, setNeedle] = useState(START_NEEDLE);
  const [lastPoints, setLastPoints] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);

  const countByCategory = useMemo(() => countCategories(spectrums), [spectrums]);
  const availableCount = sumCounts(countByCategory, activeCategories);

  const startGame = useCallback(() => {
    const pool = spectrums.filter((s) => activeCategories.includes(s.category));
    if (pool.length === 0) return;
    setRounds(
      shuffle(pool)
        .slice(0, roundCount)
        .map((spectrum, index) => ({
          spectrum,
          target: randomTarget(),
          team: (teamCount === 2 ? index % 2 : 0) as TeamIndex,
        })),
    );
    setCurrentIndex(0);
    setTargetVisible(false);
    setNeedle(START_NEEDLE);
    setScores([0, 0]);
    setPhase('clue');
  }, [spectrums, activeCategories, roundCount, teamCount]);

  const currentRound = rounds[currentIndex] ?? null;

  const showTarget = useCallback(() => setTargetVisible(true), []);

  const hideTarget = useCallback(() => {
    setTargetVisible(false);
    setNeedle(START_NEEDLE);
    setPhase('guess');
  }, []);

  const reveal = useCallback(() => {
    if (!currentRound) return;
    const points = scoreFor(needle, currentRound.target);
    setLastPoints(points);
    setScores((prev) => {
      const next: [number, number] = [...prev];
      next[currentRound.team] += points;
      return next;
    });
    setPhase('reveal');
  }, [currentRound, needle]);

  const nextRound = useCallback(() => {
    if (currentIndex + 1 >= rounds.length) {
      setPhase('end');
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setTargetVisible(false);
    setNeedle(START_NEEDLE);
    setPhase('clue');
  }, [currentIndex, rounds.length]);

  const backToSetup = useCallback(() => {
    setRounds([]);
    setCurrentIndex(0);
    setTargetVisible(false);
    setPhase('setup');
  }, []);

  const spectrum = currentRound?.spectrum;

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
        teamCount,
        setTeamCount,
        roundCount,
        setRoundCount,
        rounds,
        currentIndex,
        currentRound,
        left: spectrum ? (locale === 'en' ? spectrum.leftEn : spectrum.left) : '',
        right: spectrum ? (locale === 'en' ? spectrum.rightEn : spectrum.right) : '',
        targetVisible,
        needle,
        setNeedle,
        lastPoints,
        scores,
        isLastRound: currentIndex === rounds.length - 1,
        startGame,
        showTarget,
        hideTarget,
        reveal,
        nextRound,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
