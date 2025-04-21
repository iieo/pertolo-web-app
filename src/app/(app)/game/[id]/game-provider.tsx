"use client"
import { GameModel, GameSettings, TaskModel } from '@/db/schema';
import { replaceNames } from '@/util/tasks';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameContextType = {
    settings: GameSettings;
    game: GameModel;
    currentTask: TaskModel | null;
    tasks: TaskModel[];
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
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    const replacePlayerNames = React.useCallback(
        (content: string) => replaceNames(content, game.gameSettings.players),
        [game.gameSettings.players]
    );

    const showNextTask = React.useCallback(() => {
        setCurrentTaskIndex(current => current + 1);
    }, [tasks.length]);

    const currentTask = tasks[currentTaskIndex] ?? null;

    return (
        <GameContext.Provider value={{
            game,
            settings: game.gameSettings,
            replacePlayerNames,
            tasks,
            currentTask,
            showNextTask,
        }}>
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