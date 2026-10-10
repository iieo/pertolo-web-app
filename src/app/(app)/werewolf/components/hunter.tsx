'use client';

import { useState } from 'react';

import { act } from '../actions';
import type { Turn } from '../lib/view';
import { HUNTER } from '../palette';
import { useRoom } from './room-context';
import { ActionError, GameScreen, PlayerTile, primaryButtonClass, TileGrid } from './ui';

export function HunterTurn({ turn }: { turn: Extract<Turn, { kind: 'hunter' }> }) {
  const { t, name, run, busy, gameId } = useRoom();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <GameScreen
      color={HUNTER}
      title={t.hunterTitle}
      intro={t.hunterText}
      footer={
        <>
          <ActionError />
          <button
            type="button"
            className={primaryButtonClass}
            disabled={busy || !selected}
            onClick={() =>
              selected && run(() => act(gameId, { type: 'hunterShot', targetId: selected }))
            }
          >
            {t.shoot}
          </button>
        </>
      }
    >
      <TileGrid label={t.hunterTitle}>
        {turn.targets.map((id) => (
          <PlayerTile
            key={id}
            name={name(id)}
            selected={selected === id}
            onClick={() => setSelected(id)}
          />
        ))}
      </TileGrid>
    </GameScreen>
  );
}
