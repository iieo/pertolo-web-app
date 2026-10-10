'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { claimPlayer, dbGetGameOverview } from '../../actions';
import { PageShell, primaryButtonClass, secondaryButtonClass } from '../../components/shell';
import { usePoll } from '../../components/use-poll';
import { errorMessage } from '../../i18n';
import { gamePath, playerPath } from '../../limits';
import { useT } from '../../locale';
import type { Overview, OverviewPlayer } from '../../types';

export default function GameOverview({ initial }: { initial: Overview }) {
  const { t } = useT();
  const router = useRouter();
  const [overview, setOverview] = useState(initial);
  const [pending, setPending] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { gameId, players, you, winner } = overview;
  const gameOver = winner !== null;
  const youWon = you !== null && you.name === winner;
  const canClaim = you === null && !gameOver;
  const alive = players.filter((p) => p.alive).length;

  const refresh = async () => {
    const result = await dbGetGameOverview(gameId);
    if (result.success) setOverview(result.data);
  };

  usePoll(refresh, !gameOver);

  const handleClaim = async (name: string) => {
    if (claiming) return;
    setClaiming(true);
    setError(null);
    try {
      const result = await claimPlayer(gameId, name);
      if (result.success) {
        router.push(playerPath(gameId, result.data.name));
        return;
      }
      setError(result.error);
      setPending(null);
      await refresh().catch(() => {});
    } catch {
      setError('unknown');
    }
    setClaiming(false);
  };

  let title: string;
  let subtitle: string | null = null;
  if (gameOver) {
    title = youWon ? t.youWon : t.gameOver;
    subtitle = youWon ? t.youWonHint : t.winnerIs(winner ?? '');
  } else if (you && !you.alive) {
    title = t.youAreOut;
    subtitle = t.youAreOutHint;
  } else if (you) {
    title = t.youAre(you.name);
  } else {
    title = t.whoAreYou;
    subtitle = t.whoAreYouHint;
  }

  const targetHref = you && you.alive && !gameOver ? playerPath(gameId, you.name) : null;

  return (
    <PageShell
      backHref="/murderi"
      footer={
        gameOver ? undefined : (
          <div className="flex flex-col gap-2">
            {targetHref && (
              <Link href={targetHref} className={primaryButtonClass}>
                {t.showTarget}
              </Link>
            )}
            <Link href={`${gamePath(gameId)}/share`} className={secondaryButtonClass}>
              {t.shareGame}
            </Link>
          </div>
        )
      }
    >
      <p className="text-sm font-medium text-white/60">{t.gameLabel(gameId)}</p>
      <h1
        className="mt-2 text-4xl font-bold tracking-tight break-words md:text-5xl"
        aria-live="polite"
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-base leading-relaxed break-words text-white/60">{subtitle}</p>
      )}

      <section className="mt-12" aria-labelledby="murderi-overview-players">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="murderi-overview-players" className="text-xl font-semibold">
            {t.playersHeading}
          </h2>
          {!gameOver && (
            <p className="text-sm text-white/60 tabular-nums">
              {t.aliveCount(alive, players.length)}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[#f87171]">
            {errorMessage(t, error)}
          </p>
        )}

        <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {players.map((player) => {
            const claimable = canClaim && player.alive && !player.claimed;
            return (
              <li key={player.name}>
                <PlayerRow
                  player={player}
                  isYou={you?.name === player.name}
                  isWinner={player.name === winner}
                  canClaim={claimable}
                  showClaimState={canClaim}
                  selected={pending === player.name}
                  onSelect={() => {
                    setPending(player.name);
                    setError(null);
                  }}
                />
                {claimable && pending === player.name && (
                  <div className="flex flex-col gap-2 pb-4">
                    <button
                      type="button"
                      className={primaryButtonClass}
                      disabled={claiming}
                      onClick={() => handleClaim(player.name)}
                    >
                      <span className="min-w-0 break-words">
                        {claiming ? t.claiming : t.claimAs(player.name)}
                      </span>
                    </button>
                    <button
                      type="button"
                      className={secondaryButtonClass}
                      disabled={claiming}
                      onClick={() => setPending(null)}
                    >
                      {t.cancel}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </PageShell>
  );
}

function PlayerRow({
  player,
  isYou,
  isWinner,
  canClaim,
  showClaimState,
  selected,
  onSelect,
}: {
  player: OverviewPlayer;
  isYou: boolean;
  isWinner: boolean;
  canClaim: boolean;
  showClaimState: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const { t } = useT();

  const label = isYou ? t.youName(player.name) : player.name;
  let status: string | null = null;
  if (isWinner) status = t.winnerLabel;
  else if (player.alive && showClaimState) status = player.claimed ? t.taken : t.free;

  const content = (
    <>
      <span
        className={cn(
          'min-w-0 text-base break-words',
          player.alive ? 'text-white' : 'text-white/50 line-through',
          isYou && 'font-semibold',
        )}
      >
        {label}
      </span>
      {status && <span className="shrink-0 text-sm text-white/60">{status}</span>}
    </>
  );

  const rowClass = 'flex min-h-14 w-full items-center justify-between gap-4 py-2 text-left';

  if (!canClaim) return <div className={rowClass}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={selected}
      className={cn(
        rowClass,
        '-mx-2 w-[calc(100%+1rem)] rounded-xl px-2 outline-none transition-colors duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white motion-reduce:transition-none',
        selected && 'bg-white/10',
      )}
    >
      {content}
    </button>
  );
}
