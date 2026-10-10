'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { useCategorySelection } from '@/components/game/category-selection';
import { createLocaleStore, type Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';
import { countPlayerSlots } from '@/util/tasks';

import { getDrinkTasks } from './actions';
import { MIXED_CATEGORIES, playableCount } from './categories';
import { DICTIONARIES, Dictionary } from './i18n';
import { MIN_PLAYERS, usePlayers } from './players';
import {
  CategoryKey,
  DeckCard,
  DrinkCategory,
  DrinkTask,
  GamePhase,
  LoadError,
  StartError,
} from './types';

const { useLocale, setLocale } = createLocaleStore('drink-locale');

type GameContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  phase: GamePhase;
  players: string[] | null;
  categories: DrinkCategory[];
  loadError: LoadError | null;
  mixed: boolean;
  selectMixed: () => void;
  selectedCategories: CategoryKey[];
  toggleCategory: (key: CategoryKey) => void;
  countFor: (category: DrinkCategory) => number;
  mixedCount: number;
  availableCount: number;
  starting: boolean;
  startError: StartError | null;
  deck: DeckCard[];
  currentIndex: number;
  currentCard: DeckCard | null;
  playedCount: number;
  isLastTask: boolean;
  goToPlayers: () => void;
  goToCategories: () => void;
  startGame: () => Promise<boolean>;
  nextTask: () => void;
  backToSetup: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useDrinkGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useDrinkGame must be used within a GameProvider');
  }
  return context;
};

// Every {{player}} stands for a different person. Names only repeat once all players are used.
function drawNames(slots: number, players: string[]): string[] {
  const names: string[] = [];
  let pool: string[] = [];
  for (let i = 0; i < slots; i++) {
    if (pool.length === 0) pool = shuffle(players);
    names.push(pool.pop()!);
  }
  return names;
}

function randomSips() {
  return 2 + Math.floor(Math.random() * 4);
}

function toCard(task: DrinkTask, players: string[]): DeckCard {
  return {
    kind: task.kind,
    content: task.content,
    contentEn: task.contentEn,
    names: drawNames(countPlayerSlots(task.content), players),
    sips: randomSips(),
    rounds: task.rounds,
    seconds: task.seconds,
    repeatsRule: false,
  };
}

function endCard(task: DrinkTask, card: DeckCard): DeckCard {
  const ownText = task.endContent !== null;
  return {
    ...card,
    kind: card.kind === 'curse' ? 'curseEnd' : 'ruleEnd',
    content: task.endContent ?? task.content,
    contentEn: ownText ? (task.endContentEn ?? null) : task.contentEn,
    repeatsRule: !ownText,
  };
}

/**
 * A rule or curse covers the next `rounds` regular cards. Its end card follows right after them,
 * and end cards themselves do not count. Rules still running when the deck ends are lifted at
 * the very end.
 */
function buildDeck(tasks: DrinkTask[], players: string[]): DeckCard[] {
  const deck: DeckCard[] = [];
  let running: { remaining: number; end: DeckCard }[] = [];

  for (const task of shuffle(tasks)) {
    if (countPlayerSlots(task.content) > players.length) continue;
    const card = toCard(task, players);
    deck.push(card);

    const stillRunning: typeof running = [];
    for (const entry of running) {
      if (entry.remaining <= 1) deck.push(entry.end);
      else stillRunning.push({ ...entry, remaining: entry.remaining - 1 });
    }
    running = stillRunning;

    if ((card.kind === 'rule' || card.kind === 'curse') && card.rounds) {
      running.push({ remaining: card.rounds, end: endCard(task, card) });
    }
  }

  for (const entry of running) deck.push(entry.end);
  return deck;
}

function isEndCard(card: DeckCard) {
  return card.kind === 'ruleEnd' || card.kind === 'curseEnd';
}

export const GameProvider = ({
  children,
  categories,
  loadError,
}: {
  children: React.ReactNode;
  categories: DrinkCategory[];
  loadError: LoadError | null;
}) => {
  const locale = useLocale();
  const players = usePlayers();
  const [phase, setPhase] = useState<GamePhase>('players');
  const {
    mixed,
    selected: selectedCategories,
    active: activeKeys,
    selectMixed: selectMixedKeys,
    toggle,
  } = useCategorySelection(MIXED_CATEGORIES);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<StartError | null>(null);
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const taskCache = useRef(new Map<string, DrinkTask[]>());

  const playerCount = players?.length ?? 0;

  const activeCategories = useMemo(
    () => categories.filter((category) => activeKeys.includes(category.key)),
    [categories, activeKeys],
  );

  const countFor = useCallback(
    (category: DrinkCategory) => playableCount(category, playerCount),
    [playerCount],
  );

  const mixedCount = categories
    .filter((category) => MIXED_CATEGORIES.includes(category.key))
    .reduce((sum, category) => sum + countFor(category), 0);

  const availableCount = activeCategories.reduce((sum, category) => sum + countFor(category), 0);

  const selectMixed = useCallback(() => {
    selectMixedKeys();
    setStartError(null);
  }, [selectMixedKeys]);

  const toggleCategory = useCallback(
    (key: CategoryKey) => {
      setStartError(null);
      toggle(key);
    },
    [toggle],
  );

  const goToPlayers = useCallback(() => {
    setStartError(null);
    setPhase('players');
  }, []);

  const goToCategories = useCallback(() => {
    if (playerCount < MIN_PLAYERS) return;
    setStartError(null);
    setPhase('categories');
  }, [playerCount]);

  const startGame = useCallback(async () => {
    if (!players || players.length < MIN_PLAYERS || activeCategories.length === 0) return false;
    setStarting(true);
    setStartError(null);
    try {
      const missing = activeCategories
        .map((category) => category.id)
        .filter((id) => !taskCache.current.has(id));
      if (missing.length > 0) {
        const result = await getDrinkTasks(missing);
        if (!result.success) {
          setStartError('loadFailed');
          return false;
        }
        for (const id of missing) taskCache.current.set(id, []);
        for (const task of result.data) taskCache.current.get(task.categoryId)?.push(task);
      }

      const tasks = activeCategories.flatMap(
        (category) => taskCache.current.get(category.id) ?? [],
      );
      const nextDeck = buildDeck(tasks, players);
      if (nextDeck.length === 0) {
        setStartError('noTasks');
        return false;
      }

      setDeck(nextDeck);
      setCurrentIndex(0);
      setPhase('playing');
      return true;
    } catch {
      setStartError('offline');
      return false;
    } finally {
      setStarting(false);
    }
  }, [players, activeCategories]);

  const nextTask = useCallback(() => {
    if (currentIndex + 1 >= deck.length) {
      setPhase('end');
      return;
    }
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, deck.length]);

  const backToSetup = useCallback(() => {
    setDeck([]);
    setCurrentIndex(0);
    setPhase(playerCount < MIN_PLAYERS ? 'players' : 'categories');
  }, [playerCount]);

  const playedCount = useMemo(() => deck.filter((card) => !isEndCard(card)).length, [deck]);

  return (
    <GameContext.Provider
      value={{
        locale,
        setLocale,
        t: DICTIONARIES[locale],
        phase,
        players,
        categories,
        loadError,
        mixed,
        selectMixed,
        selectedCategories,
        toggleCategory,
        countFor,
        mixedCount,
        availableCount,
        starting,
        startError,
        deck,
        currentIndex,
        currentCard: deck[currentIndex] ?? null,
        playedCount,
        isLastTask: currentIndex === deck.length - 1,
        goToPlayers,
        goToCategories,
        startGame,
        nextTask,
        backToSetup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
