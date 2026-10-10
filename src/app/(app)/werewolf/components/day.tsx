'use client';

import { skipStep, startVote } from '../actions';
import { DAY } from '../palette';
import { MyRoleButton } from './my-role';
import { DeathList, MorningInfo, Roster } from './people';
import { useRoom } from './room-context';
import { ActionError, GameScreen, HostSkip, primaryButtonClass } from './ui';

export function DayScreen() {
  const { game, view, t, name, run, busy, gameId } = useRoom();
  if (!game) return null;
  const meAlive = view.players.find((p) => p.isMe)?.alive ?? false;
  const hunterId = game.pendingHunterId;

  return (
    <GameScreen
      color={DAY}
      headerExtra={<MyRoleButton />}
      title={t.dayTitle}
      intro={meAlive ? t.discussText : t.youAreOut}
      footer={
        view.isHost ? (
          <>
            <ActionError />
            <HostSkip onSkip={() => run(() => skipStep(gameId))} />
            <button
              type="button"
              className={primaryButtonClass}
              disabled={busy || hunterId !== null}
              onClick={() => run(() => startVote(gameId))}
            >
              {t.startVote}
            </button>
          </>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-4" aria-live="polite">
          <h2 className="text-base font-medium">{t.morningHeading}</h2>
          {game.announcement.length === 0 ? (
            <p className="text-2xl font-semibold md:text-4xl">{t.noDeaths}</p>
          ) : (
            <DeathList deaths={game.announcement} />
          )}
          <MorningInfo />
          {hunterId && (
            <p className="text-lg font-semibold md:text-xl">{t.hunterChoosing(name(hunterId))}</p>
          )}
        </section>
        <Roster />
      </div>
    </GameScreen>
  );
}
