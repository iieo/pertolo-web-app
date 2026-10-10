'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { dbGetMyState, dbGetTransferLink, dbUpdateVictim } from '../../../actions';
import {
  columnClass,
  gutterClass,
  Header,
  primaryButtonClass,
  secondaryButtonClass,
  textButtonClass,
} from '../../../components/shell';
import { usePoll } from '../../../components/use-poll';
import { errorMessage } from '../../../i18n';
import { gamePath } from '../../../limits';
import { useT } from '../../../locale';
import { colorFor, WIN_COLOR } from '../../../palette';

export default function PlayerGameView({
  gameId,
  name,
  initialTarget,
}: {
  gameId: string;
  name: string;
  initialTarget: string;
}) {
  const { locale, t } = useT();
  const router = useRouter();
  const [target, setTarget] = useState(initialTarget);
  const [isNewTarget, setIsNewTarget] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferPath, setTransferPath] = useState<string | null>(null);
  const [transferState, setTransferState] = useState<'idle' | 'busy' | 'copied' | 'failed'>(
    'idle',
  );
  const [transferError, setTransferError] = useState<string | null>(null);
  const transferTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isWinner = target === name;
  const overviewPath = gamePath(gameId);

  const refresh = async () => {
    const result = await dbGetMyState(gameId);
    if (!result.success) {
      if (result.error === 'notClaimed' || result.error === 'notFound') {
        router.replace(overviewPath);
      }
      return;
    }
    const next = result.data.target;
    if (next === null) {
      router.replace(overviewPath);
      return;
    }
    if (next !== target) {
      setTarget(next);
      setIsNewTarget(true);
    }
  };

  usePoll(refresh, !isWinner && !reporting);

  // Fetched ahead of the tap: share and clipboard need a fresh user gesture, which Safari drops
  // across an awaited server call.
  useEffect(() => {
    let active = true;
    dbGetTransferLink(gameId)
      .then((result) => {
        if (active && result.success) setTransferPath(result.data.path);
      })
      .catch(() => {});
    return () => {
      active = false;
      if (transferTimer.current) clearTimeout(transferTimer.current);
    };
  }, [gameId]);

  const handleTransfer = async () => {
    if (transferState === 'busy') return;
    if (transferTimer.current) clearTimeout(transferTimer.current);
    setTransferState('busy');
    setTransferError(null);

    let path = transferPath;
    if (!path) {
      try {
        const result = await dbGetTransferLink(gameId);
        if (!result.success) {
          setTransferError(result.error);
          setTransferState('idle');
          return;
        }
        path = result.data.path;
        setTransferPath(path);
      } catch {
        setTransferError('unknown');
        setTransferState('idle');
        return;
      }
    }
    const url = `${window.location.origin}${path}`;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: t.title, url });
        setTransferState('idle');
        return;
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === 'AbortError') {
          setTransferState('idle');
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setTransferState('copied');
      transferTimer.current = setTimeout(() => setTransferState('idle'), 4000);
    } catch {
      setTransferState('failed');
    }
  };

  const transferStatus =
    transferState === 'copied'
      ? t.transferCopied
      : transferState === 'failed'
        ? t.transferCopyFailed
        : transferError
          ? errorMessage(t, transferError)
          : null;

  const handleReport = async () => {
    if (reporting) return;
    setReporting(true);
    setError(null);
    try {
      const result = await dbUpdateVictim(gameId);
      if (result.success || result.error === 'alreadyDead' || result.error === 'notClaimed') {
        router.replace(overviewPath);
        return;
      }
      setError(result.error);
      setConfirming(false);
      await refresh().catch(() => {});
    } catch {
      setError('unknown');
    }
    setReporting(false);
  };

  const color = isWinner ? WIN_COLOR : colorFor(target);

  return (
    <div lang={locale} className="flex min-h-dvh w-full flex-col bg-black text-white">
      <div className={gutterClass}>
        <div className={cn(columnClass, 'pt-[max(1rem,env(safe-area-inset-top))] pb-4')}>
          <Header backHref={overviewPath} backLabel={t.overview} />
        </div>
      </div>

      <section
        className={cn('flex flex-1 flex-col', gutterClass)}
        style={{ backgroundColor: color.bg, color: color.fg }}
        aria-live="polite"
      >
        <div className={cn(columnClass, 'flex flex-1 flex-col justify-center gap-4 py-12')}>
          <p className="text-base font-medium break-words">{t.youAre(name)}</p>
          {isWinner ? (
            <>
              <h1 className="text-5xl font-bold tracking-tight break-words md:text-6xl">
                {t.youWon}
              </h1>
              <p className="text-lg leading-relaxed">{t.youWonHint}</p>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold">{isNewTarget ? t.newTarget : t.yourTarget}</h1>
              <p className="text-5xl font-bold tracking-tight break-words hyphens-auto [overflow-wrap:anywhere] md:text-6xl">
                {target}
              </p>
              <p className="text-lg leading-relaxed">{t.targetHint}</p>
            </>
          )}
        </div>
      </section>

      <div className={gutterClass}>
        <div
          className={cn(
            columnClass,
            'flex flex-col gap-2 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]',
          )}
        >
          {error && (
            <p role="alert" className="pb-2 text-sm text-[#f87171]">
              {errorMessage(t, error)}
            </p>
          )}
          {isWinner ? (
            <Link href={overviewPath} className={secondaryButtonClass}>
              {t.overview}
            </Link>
          ) : confirming ? (
            <>
              <div className="flex flex-col gap-1 pb-2">
                <p className="text-xl font-semibold">{t.confirmTitle}</p>
                <p className="text-base leading-relaxed text-white/60">{t.confirmHint}</p>
              </div>
              <button
                type="button"
                className={primaryButtonClass}
                disabled={reporting}
                onClick={handleReport}
              >
                {reporting ? t.reporting : t.confirmKilled}
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                disabled={reporting}
                onClick={() => setConfirming(false)}
              >
                {t.cancel}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => {
                setConfirming(true);
                setError(null);
              }}
            >
              {t.reportKilled}
            </button>
          )}
          {!confirming && (
            <div className="flex flex-col gap-2 pt-6">
              <button
                type="button"
                className={textButtonClass}
                disabled={transferState === 'busy'}
                onClick={handleTransfer}
              >
                {t.transferDevice}
              </button>
              <p className="text-center text-sm leading-relaxed text-white/60">{t.transferHint}</p>
              <p role="status" className="text-center text-sm text-white/60">
                {transferStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
