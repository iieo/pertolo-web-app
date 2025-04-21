"use client"
import { GameModel, GameSettings, TaskModel } from '@/db/schema';
import { replaceNames } from '@/util/tasks';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameContextType = {
    settings: GameSettings;
    game: GameModel;
    currentTask: TaskModel;
    tasks: TaskModel[];
    replacePlayerNames: (content: string) => string;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children, game, tasks }: { children: ReactNode, game: GameModel, tasks: TaskModel[] }) => {
    const initialTask = tasks[0];
    if (!initialTask) {
        throw new Error('No tasks available');
    }
    const [currentTask, setCurrentTask] = useState<TaskModel>(initialTask);

    const replacePlayerNames = (content: string) => {
        return replaceNames(content, game.gameSettings.players);
    };

    return (
        <GameContext.Provider value={{ game, settings: game.gameSettings, replacePlayerNames, tasks, currentTask }}>
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