'use client';

import { useEffect } from 'react';

import { GameProvider, useBluffGame } from './game-provider';
import { SecretPhase } from './components/secret-phase';
import { WordPhase } from './components/word-phase';
import { Word } from './types';

function BluffGameContent() {
    const { phase } = useBluffGame();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [phase]);

    switch (phase) {
        case 'word':
            return <WordPhase />;
        case 'secret':
            return <SecretPhase />;
    }
}

export function BluffClient({ words }: { words: Word[] }) {
    return (
        <GameProvider words={words}>
            <BluffGameContent />
        </GameProvider>
    );
}
