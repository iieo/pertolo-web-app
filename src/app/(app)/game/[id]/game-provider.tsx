"use client"
import { GameModel, GameSettings } from '@/db/schema';
import { replaceNames } from '@/util/tasks';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameContextType = {
    settings: GameSettings;
    game: GameModel;
    replacePlayerNames: (content: string) => string;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children, game }: { children: ReactNode, game: GameModel }) => {

    const replacePlayerNames = (content: string) => {
        return replaceNames(content, game.gameSettings.players);
    };

    return (
        <GameContext.Provider value={{ game, settings: game.gameSettings, replacePlayerNames }}>
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