'use client';

import { useState } from 'react';

import { playAgain } from '../actions';
import { END_COLORS } from '../palette';
import { useRoom } from './room-context';
import { ActionError, GameScreen, NameList, primaryButtonClass, secondaryButtonClass } from './ui';

export function EndScreen() {
  const { game, view, t, name, run, busy, gameId, quit } = useRoom();
  const [leaving, setLeaving] = useState(false);
  const end = game?.end;
  if (!end) return null;

  return (
    <GameScreen
      color={END_COLORS[end.winner]}
      title={t.winTitles[end.winner]}
      intro={t.winTexts[end.winner]}
      footer={
        <>
          <ActionError />
          {view.isHost ? (
            <button
              type="button"
              className={primaryButtonClass}
              disabled={busy}
              onClick={() => run(() => playAgain(gameId))}
            >
              {t.playAgain}
            </button>
          ) : (
            <p className="text-center text-base">{t.waitingForNewRound}</p>
          )}
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={leaving}
            onClick={async () => {
              setLeaving(true);
              await quit();
            }}
          >
            {t.quit}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        {end.lovers && (
          <p className="text-lg font-semibold">
            {t.lovers(name(end.lovers[0]), name(end.lovers[1]))}
          </p>
        )}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">{t.everyoneHeading}</h2>
          <NameList>
            {view.players.map((p) => {
              const dealt = end.initialRoles[p.id];
              const notes = [
                p.role && t.roles[p.role].name,
                dealt && dealt !== p.role && t.dealtAs(t.roles[dealt].name),
                end.winnerIds.includes(p.id) && t.won,
                !p.alive && t.dead,
              ].filter(Boolean);
              return (
                <li key={p.id}>
                  <span className="block text-lg font-semibold wrap-break-word">
                    {p.name}
                    {p.isMe && <span className="font-normal">{` (${t.you})`}</span>}
                  </span>
                  <span className="block text-base">{notes.join(', ')}</span>
                </li>
              );
            })}
          </NameList>
        </section>
      </div>
    </GameScreen>
  );
}
