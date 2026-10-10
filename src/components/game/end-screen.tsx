'use client';

import Link from 'next/link';

import { exitFullscreen } from './fullscreen';
import { PageShell, primaryButtonClass, secondaryButtonClass } from './page-shell';

export function EndScreen({
  title,
  detail,
  playAgainLabel,
  homeLabel,
  onPlayAgain,
}: {
  title: string;
  detail: string;
  playAgainLabel: string;
  homeLabel: string;
  onPlayAgain: () => void;
}) {
  return (
    <PageShell
      footer={
        <div className="flex flex-col gap-2">
          <button type="button" className={primaryButtonClass} onClick={onPlayAgain}>
            {playAgainLabel}
          </button>
          <Link href="/" className={secondaryButtonClass} onClick={() => exitFullscreen()}>
            {homeLabel}
          </Link>
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="text-base leading-relaxed text-white/60 tabular-nums">{detail}</p>
      </div>
    </PageShell>
  );
}
