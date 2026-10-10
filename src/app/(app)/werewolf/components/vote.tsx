'use client';

import { useState } from 'react';

import { continueGame, endVote, judge, skipStep, vote } from '../actions';
import { VOTE } from '../palette';
import { MyRoleButton } from './my-role';
import { DeathList, MorningInfo } from './people';
import { useRoom } from './room-context';
import {
  ActionError,
  GameScreen,
  HostSkip,
  NameList,
  PlayerTile,
  primaryButtonClass,
  secondaryButtonClass,
  TileGrid,
} from './ui';

export function VoteScreen() {
  const { game, view, t, name, run, busy, gameId } = useRoom();
  const current = game?.vote;
  // undefined = nothing picked, null = abstain.
  const [selected, setSelected] = useState<string | null | undefined>(current?.myVote);
  if (!game || !current) return null;

  const meAlive = view.players.find((p) => p.isMe)?.alive ?? false;
  const voted = current.eligibleIds.filter((id) => current.votedIds.includes(id));
  const waiting = current.eligibleIds.filter((id) => !current.votedIds.includes(id));
  const changed = selected !== undefined && selected !== current.myVote;

  return (
    <GameScreen
      color={VOTE}
      headerExtra={<MyRoleButton />}
      title={current.second ? t.secondVoteTitle : t.voteTitle}
      intro={
        current.canVote ? (
          <>
            {current.second ? t.secondVoteText : t.voteText}
            {current.myWeight > 1 && <span className="mt-2 block">{t.voteDouble}</span>}
          </>
        ) : meAlive ? (
          t.cannotVote
        ) : (
          t.youAreOut
        )
      }
      footer={
        <>
          <ActionError />
          {current.myVote !== undefined && (
            <p className="text-center text-base font-semibold" aria-live="polite">
              {current.myVote === null ? t.youAbstained : t.yourVote(name(current.myVote))}
            </p>
          )}
          {current.canVote && (
            <button
              type="button"
              className={primaryButtonClass}
              disabled={busy || !changed}
              onClick={() => selected !== undefined && run(() => vote(gameId, selected))}
            >
              {t.castVote}
            </button>
          )}
          {view.isHost && (
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={busy}
              onClick={() => run(() => endVote(gameId))}
            >
              {t.endVote}
            </button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-12">
        {current.canVote && (
          <TileGrid label={t.voteTitle}>
            {current.targets.map((id) => (
              <PlayerTile
                key={id}
                name={name(id)}
                sub={id === game.mayorId ? t.roles.mayor.name : undefined}
                selected={selected === id}
                onClick={() => setSelected(id)}
              />
            ))}
            <PlayerTile
              name={t.abstain}
              selected={selected === null}
              onClick={() => setSelected(null)}
            />
          </TileGrid>
        )}
        <MorningInfo />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <StatusList heading={t.waitingHeading} names={waiting.map(name)} />
          <StatusList heading={t.votedHeading} names={voted.map(name)} />
        </div>
      </div>
    </GameScreen>
  );
}

function StatusList({ heading, names }: { heading: string; names: string[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{`${heading} (${names.length})`}</h2>
      <ul className="flex flex-col gap-1">
        {names.map((n) => (
          <li key={n} className="text-base wrap-break-word">
            {n}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function VoteResultScreen() {
  const { game, view, t, name, player, run, busy, gameId } = useRoom();
  const result = game?.voteResult;
  if (!game || !result) return null;

  const eliminated = player(result.eliminatedId);
  const eliminatedRole =
    game.announcement.find((d) => d.playerId === result.eliminatedId)?.role ?? eliminated?.role;
  const chain = game.announcement.filter((d) => d.playerId !== result.eliminatedId);
  const hunterId = game.pendingHunterId;

  return (
    <GameScreen
      color={VOTE}
      headerExtra={<MyRoleButton />}
      title={result.second ? t.secondResultTitle : t.resultTitle}
      footer={
        view.isHost || game.judgeAvailable ? (
          <>
            <ActionError />
            {game.judgeAvailable && (
              <>
                <p className="text-center text-sm text-(--muted)">{t.judgeHint}</p>
                <button
                  type="button"
                  className={secondaryButtonClass}
                  disabled={busy || hunterId !== null}
                  onClick={() => run(() => judge(gameId))}
                >
                  {t.judgeButton}
                </button>
              </>
            )}
            {view.isHost && (
              <>
                <HostSkip onSkip={() => run(() => skipStep(gameId))} />
                <button
                  type="button"
                  className={primaryButtonClass}
                  disabled={busy || hunterId !== null}
                  onClick={() => run(() => continueGame(gameId))}
                >
                  {t.continueToNight}
                </button>
              </>
            )}
          </>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-2" aria-live="polite">
          {result.eliminatedId && result.idiotRevealed ? (
            <p className="text-2xl font-semibold md:text-4xl">
              {t.idiotRevealed(name(result.eliminatedId))}
            </p>
          ) : result.eliminatedId ? (
            <>
              <p className="text-3xl font-bold wrap-break-word md:text-5xl">
                {result.scapegoat
                  ? t.scapegoatDied(name(result.eliminatedId))
                  : t.eliminated(name(result.eliminatedId))}
              </p>
              {eliminatedRole && (
                <p className="text-xl font-semibold md:text-2xl">{t.roles[eliminatedRole].name}</p>
              )}
            </>
          ) : (
            <p className="text-2xl font-semibold md:text-4xl">
              {result.tally.length === 0 ? t.noVotes : t.tie}
            </p>
          )}
          {hunterId && (
            <p className="mt-4 text-lg font-semibold md:text-xl">
              {t.hunterChoosing(name(hunterId))}
            </p>
          )}
        </section>

        {chain.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-medium">{t.alsoDied}</h2>
            <DeathList deaths={chain} />
          </section>
        )}

        {(result.tally.length > 0 || result.abstained > 0) && (
          <section className="flex flex-col gap-4">
            <NameList>
              {result.tally.map((row) => (
                <li key={row.playerId} className="flex items-baseline justify-between gap-4">
                  <span className="min-w-0 text-lg font-semibold wrap-break-word">
                    {name(row.playerId)}
                  </span>
                  <span className="shrink-0 text-base tabular-nums">{t.votesCount(row.votes)}</span>
                </li>
              ))}
            </NameList>
            {result.abstained > 0 && (
              <p className="text-base tabular-nums">{t.abstainedCount(result.abstained)}</p>
            )}
          </section>
        )}
      </div>
    </GameScreen>
  );
}
