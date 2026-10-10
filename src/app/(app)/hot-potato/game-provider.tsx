'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  countByCategory as countCategories,
  sumCounts,
  useCategorySelection,
} from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';

import { BombAudio } from './audio';
import { MAX_PROMPTS, MIXED_CATEGORIES } from './categories';
import { DICTIONARIES, Dictionary } from './i18n';
import { CategoryKey, FuseLength, GamePhase, Prompt } from './types';

const { useLocale, setLocale } = createLocaleStore('hot-potato-locale');

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
  fuseLength: FuseLength;
  setFuseLength: (length: FuseLength) => void;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  audio: BombAudio;
  deck: Prompt[];
  currentIndex: number;
  currentPrompt: string | null;
  isLastPrompt: boolean;
  startGame: () => void;
  lightFuse: () => void;
  explode: () => void;
  nextPrompt: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useHotPotatoGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useHotPotatoGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({
  children,
  prompts,
}: {
  children: React.ReactNode;
  prompts: Prompt[];
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
  const [fuseLength, setFuseLength] = useState<FuseLength>('normal');
  const [soundOn, setSoundOn] = useState(true);
  const [audio] = useState(() => new BombAudio());
  const [deck, setDeck] = useState<Prompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => () => audio.close(), [audio]);

  const countByCategory = useMemo(() => countCategories(prompts), [prompts]);

  const availableCount = sumCounts(countByCategory, activeCategories);

  const startGame = useCallback(() => {
    const pool = prompts.filter((p) => activeCategories.includes(p.category));
    if (pool.length === 0) return;
    if (soundOn) audio.unlock();
    setDeck(shuffle(pool).slice(0, MAX_PROMPTS));
    setCurrentIndex(0);
    setPhase('prompt');
  }, [prompts, activeCategories, soundOn, audio]);

  const lightFuse = useCallback(() => {
    if (soundOn) audio.unlock();
    setPhase((prev) => (prev === 'prompt' ? 'ticking' : prev));
  }, [soundOn, audio]);

  const explode = useCallback(() => {
    setPhase((prev) => (prev === 'ticking' ? 'boom' : prev));
  }, []);

  const nextPrompt = useCallback(() => {
    audio.stop();
    if (currentIndex + 1 >= deck.length) {
      setPhase('end');
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setPhase('prompt');
  }, [currentIndex, deck.length, audio]);

  const backToSetup = useCallback(() => {
    audio.stop();
    setDeck([]);
    setCurrentIndex(0);
    setPhase('setup');
  }, [audio]);

  const current = deck[currentIndex] ?? null;
  const currentPrompt = current ? (locale === 'en' ? current.promptEn : current.prompt) : null;

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
        fuseLength,
        setFuseLength,
        soundOn,
        setSoundOn,
        audio,
        deck,
        currentIndex,
        currentPrompt,
        isLastPrompt: currentIndex === deck.length - 1,
        startGame,
        lightFuse,
        explode,
        nextPrompt,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
