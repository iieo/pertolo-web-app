'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

import { countPlayerSlots, replaceNames, shuffle } from '@/util/tasks';

import { DrinkCategory } from './categories';
import { getDrinkTasks } from './game/actions';
import { usePlayers } from './players';

type StartResult = { ok: true } | { ok: false; error: string };

type GameContextType = {
  category: DrinkCategory | null;
  deck: string[];
  currentIndex: number;
  currentTask: string | null;
  finished: boolean;
  startGame: (category: DrinkCategory) => Promise<StartResult>;
  nextTask: () => void;
  restart: () => void;
  endGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function buildDeck(tasks: string[], players: string[]) {
  const playable = tasks.filter((task) => countPlayerSlots(task) <= players.length);
  return shuffle(playable).map((task) => replaceNames(task, players));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const players = usePlayers();
  const [category, setCategory] = useState<DrinkCategory | null>(null);
  const [deck, setDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const taskCache = useRef(new Map<string, string[]>());

  const startGame = useCallback(
    async (next: DrinkCategory): Promise<StartResult> => {
      if (!players) return { ok: false, error: 'Spieler werden noch geladen.' };

      let tasks = taskCache.current.get(next.id);
      if (!tasks) {
        try {
          const result = await getDrinkTasks(next.id);
          if (!result.success) {
            return { ok: false, error: 'Die Aufgaben konnten nicht geladen werden.' };
          }
          tasks = result.data;
          taskCache.current.set(next.id, tasks);
        } catch {
          return { ok: false, error: 'Keine Verbindung. Bitte versuche es noch einmal.' };
        }
      }

      const nextDeck = buildDeck(tasks, players);
      if (nextDeck.length === 0) {
        return { ok: false, error: `In „${next.name}“ gibt es keine passenden Aufgaben.` };
      }

      setCategory(next);
      setDeck(nextDeck);
      setCurrentIndex(0);
      setFinished(false);
      return { ok: true };
    },
    [players],
  );

  const nextTask = useCallback(() => {
    if (currentIndex + 1 >= deck.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, deck.length]);

  const restart = useCallback(() => {
    const tasks = category && taskCache.current.get(category.id);
    if (!tasks || !players) return;
    setDeck(buildDeck(tasks, players));
    setCurrentIndex(0);
    setFinished(false);
  }, [category, players]);

  const endGame = useCallback(() => {
    setCategory(null);
    setDeck([]);
    setCurrentIndex(0);
    setFinished(false);
  }, []);

  return (
    <GameContext.Provider
      value={{
        category,
        deck,
        currentIndex,
        currentTask: deck[currentIndex] ?? null,
        finished,
        startGame,
        nextTask,
        restart,
        endGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useDrinkGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useDrinkGame must be used within a GameProvider');
  }
  return context;
}
