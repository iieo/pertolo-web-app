'use client';
import { DrinkCategoryModel, DrinkTaskModel } from '@/db/schema';
import { replaceNames } from '@/util/tasks';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameContextType = {
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
  category: DrinkCategoryModel | null;
  setCategory: React.Dispatch<React.SetStateAction<DrinkCategoryModel | null>>;
  tasks: DrinkTaskModel[];
  setTasks: React.Dispatch<React.SetStateAction<DrinkTaskModel[]>>;
  showNextTask: () => void;
  currentTask: DrinkTaskModel | null;
  gradient: string | undefined;
  replacePlayerNames: (content: string) => string;
};

const GameContext = createContext<GameContextType | undefined>(undefined);
export const GameProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const getRandomGradient = React.useCallback(() => {
    const gradients = [
      'from-purple-950 via-purple-900 to-gray-900',
      'from-pink-900 via-fuchsia-900 to-indigo-900',
      'from-blue-900 via-cyan-900 to-teal-900',
      'from-emerald-900 via-green-900 to-lime-900',
      'from-yellow-900 via-orange-900 to-red-900',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []);
  const [players, setPlayers] = useState<string[]>([]);
  const [category, setCategory] = useState<DrinkCategoryModel | null>(null);
  const [tasks, setTasks] = useState<DrinkTaskModel[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [gradient, setGradient] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    setGradient(getRandomGradient());
  }, [getRandomGradient]);

  const currentTask = currentTaskIndex < tasks.length ? tasks[currentTaskIndex] ?? null : null;


  const replacePlayerNames = React.useCallback(
    (content: string) => replaceNames(content, players),
    [players],
  );

  const showNextTask = React.useCallback(() => {
    setCurrentTaskIndex((current) => current + 1);
    setGradient(getRandomGradient());
  }, [getRandomGradient]);

  return (
    <GameContext.Provider
      value={{
        gradient,
        players,
        setPlayers,
        category,
        setCategory,
        tasks,
        setTasks,
        currentTask,
        showNextTask,
        replacePlayerNames
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useDrinkGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
