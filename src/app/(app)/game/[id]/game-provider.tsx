'use client';
import { GameModel, GameSettings, TaskModel } from '@/db/schema';
import { replaceNames } from '@/util/tasks';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameContextType = {
  settings: GameSettings;
  game: GameModel;
  currentTask: TaskModel | null;
  tasks: TaskModel[];
  gradient: string | undefined;
  showNextTask: () => void;
  replacePlayerNames: (content: string) => string;
};

const GameContext = createContext<GameContextType | undefined>(undefined);
export const GameProvider = ({
  children,
  game,
  tasks,
}: {
  children: ReactNode;
  game: GameModel;
  tasks: TaskModel[];
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
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [gradient, setGradient] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    setGradient(getRandomGradient());
  }, [getRandomGradient]);

  const replacePlayerNames = React.useCallback(
    (content: string) => replaceNames(content, game.gameSettings.players),
    [game.gameSettings.players],
  );

  const showNextTask = React.useCallback(() => {
    setCurrentTaskIndex((current) => current + 1);
    setGradient(getRandomGradient());
  }, [getRandomGradient]);

  const currentTask = tasks[currentTaskIndex] ?? null;

  return (
    <GameContext.Provider
      value={{
        game,
        settings: game.gameSettings,
        replacePlayerNames,
        gradient,
        tasks,
        currentTask,
        showNextTask,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
