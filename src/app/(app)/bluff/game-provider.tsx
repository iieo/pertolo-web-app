'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { GamePhase, SecretType, Word } from './types';

type GameContextType = {
  phase: GamePhase;
  currentWord: Word;
  secretType: SecretType | null;
  revealSecret: () => void;
  nextWord: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useBluffGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useBluffGame must be used within a GameProvider');
  }
  return context;
};

function pickRandomIndex(exclude: Set<number>, total: number): number {
  if (exclude.size >= total) return Math.floor(Math.random() * total);
  let idx: number;
  do {
    idx = Math.floor(Math.random() * total);
  } while (exclude.has(idx));
  return idx;
}

export const GameProvider = ({ children, words }: { children: React.ReactNode; words: Word[] }) => {
  const [WORDS] = useState(words);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    Math.floor(Math.random() * WORDS.length),
  );
  const [phase, setPhase] = useState<GamePhase>('word');
  const [secretType, setSecretType] = useState<SecretType | null>(null);

  const revealSecret = useCallback(() => {
    const type: SecretType = Math.random() < 0.5 ? 'truth' : 'bluff';
    setSecretType(type);
    setPhase('secret');
  }, []);

  const nextWord = useCallback(() => {
    const newUsed = new Set(usedIndices);
    newUsed.add(currentIndex);
    if (newUsed.size >= WORDS.length) newUsed.clear();
    const nextIdx = pickRandomIndex(newUsed, WORDS.length);
    setUsedIndices(newUsed);
    setCurrentIndex(nextIdx);
    setSecretType(null);
    setPhase('word');
  }, [usedIndices, currentIndex]);

  return (
    <GameContext.Provider
      value={{
        phase,
        currentWord: WORDS[currentIndex]!,
        secretType,
        revealSecret,
        nextWord,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
