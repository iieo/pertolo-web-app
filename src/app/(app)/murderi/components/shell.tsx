'use client';

import { Fragment } from 'react';
import Link from 'next/link';

import { BackLink } from '@/components/game/back-link';
import { cn } from '@/lib/utils';

import { LOCALES } from '../i18n';
import { setLocale, useT } from '../locale';

const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const buttonBase = cn(
  'w-full min-h-14 px-6 rounded-xl text-base font-semibold flex items-center justify-center text-center transition-colors duration-150 motion-reduce:transition-none disabled:opacity-40 disabled:pointer-events-none',
  focusRing,
);

export const primaryButtonClass = cn(buttonBase, 'bg-[#dc2626] text-white hover:bg-[#b91c1c]');
export const secondaryButtonClass = cn(
  buttonBase,
  'border border-white/20 text-white hover:bg-white/10',
);

export const textButtonClass = cn(
  'flex min-h-12 items-center justify-center self-center rounded-xl px-4 text-sm font-medium text-white/60 transition-colors duration-150 motion-reduce:transition-none hover:text-white disabled:opacity-40 disabled:pointer-events-none',
  focusRing,
);

export const inputClass = cn(
  'h-14 w-full min-w-0 rounded-xl border border-white/20 bg-transparent px-4 text-base text-white placeholder:text-white/40 transition-colors duration-150 motion-reduce:transition-none focus-visible:border-white',
  focusRing,
);

export const gutterClass =
  'pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))]';

export const columnClass = 'mx-auto w-full max-w-md';

export function Header({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  const { locale, t } = useT();

  return (
    <header className="flex min-h-12 items-center justify-between gap-4">
      <BackLink href={backHref} locale={locale} label={backLabel} />
      <div role="group" aria-label={t.language} className="-mr-2 flex items-center text-sm">
        {LOCALES.map((option, i) => (
          <Fragment key={option}>
            {i > 0 && (
              <span className="text-white/40" aria-hidden>
                /
              </span>
            )}
            <button
              type="button"
              lang={option}
              onClick={() => setLocale(option)}
              aria-pressed={locale === option}
              className={cn(
                'flex min-h-12 min-w-12 items-center justify-center rounded-xl px-2 transition-colors duration-150 motion-reduce:transition-none',
                focusRing,
                locale === option
                  ? 'font-semibold text-white'
                  : 'font-medium text-white/60 hover:text-white',
              )}
            >
              {option.toUpperCase()}
            </button>
          </Fragment>
        ))}
      </div>
    </header>
  );
}

// A centered column on every width, with an optional footer that sticks to the bottom on phones.
export function PageShell({
  backHref,
  backLabel,
  footer,
  children,
}: {
  backHref: string;
  backLabel?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { locale, t } = useT();

  return (
    <div lang={locale} className={cn('min-h-dvh w-full bg-black text-white', gutterClass)}>
      <div className={cn(columnClass, 'flex min-h-dvh flex-col')}>
        <div className="pt-[max(1rem,env(safe-area-inset-top))]">
          <Header backHref={backHref} backLabel={backLabel ?? t.back} />
        </div>
        <main className="flex flex-1 flex-col pt-8 pb-12">{children}</main>
        {footer && (
          <div className="sticky bottom-0 bg-black pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function NotFoundView() {
  const { t } = useT();

  return (
    <PageShell
      backHref="/murderi"
      footer={
        <Link href="/murderi" className={secondaryButtonClass}>
          {t.back}
        </Link>
      }
    >
      <div className="flex flex-1 flex-col justify-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{t.gameNotFound}</h1>
        <p className="text-base leading-relaxed text-white/60">{t.gameNotFoundHint}</p>
      </div>
    </PageShell>
  );
}
