'use client';

import { useEffect, useState } from 'react';

import { SecretPhase } from './components/secret-phase';
import { StartPhase } from './components/start-phase';
import { WordPhase } from './components/word-phase';
import { GameProvider, useBluffGame } from './game-provider';
import { Word } from './types';

function BluffGameContent() {
  const { phase } = useBluffGame();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, started]);

  if (!started) return <StartPhase onStart={() => setStarted(true)} />;

  const quit = () => setStarted(false);

  switch (phase) {
    case 'word':
      return <WordPhase onQuit={quit} />;
    case 'secret':
      return <SecretPhase onQuit={quit} />;
  }
}

export function BluffClient({ words }: { words: Word[] }) {
  return (
    <GameProvider words={words}>
      <BluffGameContent />
    </GameProvider>
  );
}
