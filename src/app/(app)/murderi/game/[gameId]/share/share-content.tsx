'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';

import { PageShell, primaryButtonClass, secondaryButtonClass } from '../../../components/shell';
import { gamePath } from '../../../limits';
import { useT } from '../../../locale';

const noopSubscribe = () => () => {};

export default function ShareContent({ gameId }: { gameId: string }) {
  const { t } = useT();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const link = useSyncExternalStore(
    noopSubscribe,
    () => `${window.location.origin}${gamePath(gameId)}`,
    () => gamePath(gameId),
  );
  const canShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === 'function',
    () => false,
  );

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(link);
      setCopyState('copied');
      resetTimer.current = setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('failed');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: t.title, text: t.shareMessage(gameId), url: link });
    } catch (error) {
      // AbortError means the share sheet was closed on purpose.
      if (!(error instanceof DOMException && error.name === 'AbortError')) await handleCopy();
    }
  };

  const copyLabel = copyState === 'copied' ? t.copied : t.copyLink;

  return (
    <PageShell
      backHref="/murderi"
      footer={
        <div className="flex flex-col gap-2">
          {canShare ? (
            <>
              <button type="button" className={primaryButtonClass} onClick={handleShare}>
                {t.share}
              </button>
              <button type="button" className={secondaryButtonClass} onClick={handleCopy}>
                {copyLabel}
              </button>
            </>
          ) : (
            <button type="button" className={primaryButtonClass} onClick={handleCopy}>
              {copyLabel}
            </button>
          )}
          <Link href={gamePath(gameId)} className={secondaryButtonClass}>
            {t.toGame}
          </Link>
        </div>
      }
    >
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t.shareTitle}</h1>
      <p className="mt-2 text-base leading-relaxed text-white/60">{t.shareSubtitle}</p>

      <div className="mt-12 flex flex-col gap-2">
        <p className="text-sm font-medium text-white/60">{t.codeLabel}</p>
        <p className="text-6xl font-bold tracking-widest tabular-nums">{gameId}</p>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <p className="text-sm font-medium text-white/60">{t.linkLabel}</p>
        <p className="text-base break-all select-all">{link}</p>
      </div>

      <p role="status" className="mt-4 text-sm text-white/60">
        {copyState === 'copied' ? t.copied : copyState === 'failed' ? t.copyFailed : null}
      </p>
    </PageShell>
  );
}
