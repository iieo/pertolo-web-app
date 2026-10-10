'use client';

import { Fragment, useEffect, useState } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';

import { FullscreenButton } from '@/components/game/fullscreen-button';
import { useScrollLock, useThemeColor } from '@/components/game/hooks';
import { createLocaleStore } from '@/components/game/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { DICTIONARIES, errorMessage, LOCALES, type Dictionary, type Locale } from '../i18n';
import { ROLE_INFO, ROLES, type Team } from '../lib/roles';
import type { Color } from '../palette';
import { useRoom } from './room-context';

const { useLocale, setLocale } = createLocaleStore('ww-locale');

export function useI18n() {
  const locale = useLocale();
  return { locale, t: DICTIONARIES[locale], setLocale };
}

export function colorVars(color: Color): React.CSSProperties {
  return { '--bg': color.bg, '--fg': color.fg, '--muted': color.muted } as React.CSSProperties;
}

const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fg)';

const buttonBase = cn(
  'w-full min-h-14 px-6 rounded-xl text-base font-semibold flex items-center justify-center text-center transition-colors duration-150 motion-reduce:transition-none disabled:opacity-40 disabled:pointer-events-none md:text-lg',
  focusRing,
);

/** Buttons read the screen colors from the --bg/--fg variables set by the shells. */
export const primaryButtonClass = cn(buttonBase, 'bg-(--fg) text-(--bg) hover:opacity-90');
export const secondaryButtonClass = cn(
  buttonBase,
  'border border-[color-mix(in_srgb,var(--fg)_35%,transparent)] text-(--fg) hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]',
);
export const textButtonClass = cn(
  'flex min-h-12 items-center rounded-xl px-2 text-base font-medium underline decoration-[color-mix(in_srgb,var(--fg)_40%,transparent)] underline-offset-4 hover:decoration-(--fg)',
  focusRing,
);

export const tileSurface = 'bg-[color-mix(in_srgb,var(--fg)_12%,transparent)]';

export const dialogContentClass =
  'max-h-[90dvh] max-w-[calc(100%-2rem)] gap-8 overflow-y-auto rounded-xl border border-white/10 bg-neutral-950 p-6 text-white [--bg:#0a0a0a] [--fg:#ffffff] [&>button:last-child]:top-2 [&>button:last-child]:right-2 [&>button:last-child]:flex [&>button:last-child]:size-11 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-xl [&>button:last-child]:bg-transparent [&>button:last-child]:text-white/70';

/** Scrolling page for setup, join and lobby. */
export function PageShell({
  color,
  header,
  footer,
  children,
}: {
  color: Color;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  useThemeColor(color.bg);
  return (
    <div
      style={colorVars(color)}
      className="min-h-dvh w-full bg-(--bg) pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] text-(--fg) sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))]"
    >
      <div
        className={cn(
          'mx-auto flex min-h-dvh w-full max-w-lg flex-col sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl',
          !header && 'pt-[max(3rem,env(safe-area-inset-top))] md:pt-16',
        )}
      >
        {header && <div className="mb-8">{header}</div>}
        <main className="flex flex-1 flex-col pb-12">{children}</main>
        {footer && (
          <div className="sticky bottom-0 bg-(--bg) pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex w-full max-w-md flex-col gap-2">{footer}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Fixed, non-scrolling game screen. Long lists scroll inside `children`. */
export function GameScreen({
  color,
  title,
  intro,
  center = false,
  headerExtra,
  footer,
  children,
}: {
  color: Color;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  center?: boolean;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  useThemeColor(color.bg);
  useScrollLock();
  return (
    <div
      style={colorVars(color)}
      className="fixed inset-0 flex h-dvh touch-manipulation flex-col overflow-hidden bg-(--bg) text-(--fg) select-none"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))]">
        <GameHeader extra={headerExtra} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pt-4 pb-6">
          <div className={cn(center && 'my-auto')}>
            {title && (
              <h1 className="text-4xl font-bold tracking-tight wrap-break-word hyphens-auto md:text-6xl">
                {title}
              </h1>
            )}
            {intro && (
              <div className="mt-2 max-w-2xl text-base leading-relaxed text-(--muted) md:mt-4 md:text-xl">
                {intro}
              </div>
            )}
            {children && <div className={cn((title || intro) && 'mt-8')}>{children}</div>}
          </div>
        </div>
        {footer && (
          <div className="pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex w-full max-w-md flex-col gap-2">{footer}</div>
          </div>
        )}
        {!footer && <div className="pb-[env(safe-area-inset-bottom)]" />}
      </div>
    </div>
  );
}

/** Sits inside an already padded column; -mx-2 lines the button text up with the content. */
export function GameHeader({ extra }: { extra?: React.ReactNode }) {
  const { t, locale, quit } = useRoom();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  return (
    <div className="-mx-2 flex shrink-0 items-center justify-between gap-4 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className={cn(
          'flex min-h-12 items-center gap-2 rounded-xl px-2 text-sm font-medium',
          focusRing,
        )}
      >
        <X size={20} aria-hidden />
        {t.quit}
      </button>
      <div className="flex items-center gap-1">
        {extra}
        <NarrationButton />
        <FullscreenButton lang={locale} className={focusRing} />
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent lang={locale} className={cn(dialogContentClass, 'sm:max-w-sm')}>
          <DialogHeader className="gap-2 pr-12 text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold text-white">{t.quitTitle}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-white/60">
              {t.quitDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={primaryButtonClass}
              disabled={leaving}
              onClick={async () => {
                setLeaving(true);
                await quit();
              }}
            >
              {t.quit}
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => setConfirmOpen(false)}
            >
              {t.keepPlaying}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NarrationButton() {
  const { view, t, narration } = useRoom();
  if (!view.isHost || !narration.supported) return null;
  const Icon = narration.enabled ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      aria-label={t.narration}
      aria-pressed={narration.enabled}
      onClick={(e) => {
        e.stopPropagation();
        narration.toggle();
      }}
      className={cn('flex min-h-12 min-w-12 items-center justify-center rounded-xl', focusRing)}
    >
      <Icon size={20} aria-hidden />
    </button>
  );
}

export function LocaleToggle({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <div role="group" aria-label={t.language} className="flex items-center text-sm">
      {LOCALES.map((option, i) => (
        <Fragment key={option}>
          {i > 0 && (
            <span className="opacity-40" aria-hidden>
              /
            </span>
          )}
          <button
            type="button"
            lang={option}
            onClick={() => setLocale(option)}
            aria-pressed={locale === option}
            className={cn(
              'flex min-h-12 min-w-10 items-center justify-center rounded-xl px-2 transition-colors duration-150 motion-reduce:transition-none',
              focusRing,
              locale === option ? 'font-semibold' : 'font-medium opacity-60 hover:opacity-80',
            )}
          >
            {option.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

const RULE_TEAMS: Team[] = ['village', 'wolves', 'solo'];

export function RulesButton({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={textButtonClass}>
        {t.rules}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent lang={locale} className={cn(dialogContentClass, 'sm:max-w-lg')}>
          <DialogHeader className="pr-12 text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold text-white">{t.rulesTitle}</DialogTitle>
          </DialogHeader>
          <ol className="flex list-decimal flex-col gap-4 pl-6 text-base leading-relaxed text-white/80">
            {t.rulesList.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <section className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold">{t.rulesRolesHeading}</h2>
            {RULE_TEAMS.map((team) => (
              <div key={team} className="flex flex-col gap-4">
                <h3 className="text-base font-medium text-white/60">{t.teams[team]}</h3>
                <dl className="flex flex-col gap-4">
                  {ROLES.filter((role) => ROLE_INFO[role].team === team).map((role) => (
                    <div key={role}>
                      <dt className="text-base font-semibold">{t.roles[role].name}</dt>
                      <dd className="text-base leading-relaxed text-white/70">
                        {t.roles[role].ability}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>
          <button type="button" className={secondaryButtonClass} onClick={() => setOpen(false)}>
            {t.rulesConfirm}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TileGrid({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
    >
      {children}
    </div>
  );
}

export function PlayerTile({
  name,
  sub,
  label,
  selected = false,
  disabled = false,
  onClick,
}: {
  name: string;
  sub?: React.ReactNode;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={selected}
      className={cn(
        'flex min-h-16 w-full flex-col items-start justify-center gap-1 rounded-xl p-4 text-left transition-colors duration-150 motion-reduce:transition-none disabled:opacity-40 md:min-h-20',
        focusRing,
        selected
          ? 'bg-(--fg) text-(--bg)'
          : cn(tileSurface, 'hover:bg-[color-mix(in_srgb,var(--fg)_20%,transparent)]'),
      )}
    >
      <span className="w-full text-lg font-semibold wrap-break-word hyphens-auto md:text-xl">
        {name}
      </span>
      {sub && <span className="w-full text-sm leading-snug md:text-base">{sub}</span>}
    </button>
  );
}

/** Inline error from the last own action. */
export function ActionError() {
  const { error, t } = useRoom();
  if (!error) return null;
  return (
    <p role="alert" className="text-center text-base font-semibold">
      {errorMessage(t, error)}
    </p>
  );
}

/** Host fallback for a stuck step: appears once the server allows skipping. */
export function HostSkip({ onSkip }: { onSkip: () => void }) {
  const { game, clockOffset, t, busy } = useRoom();
  const at = game?.skipAvailableAt ?? null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (at === null) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [at]);

  if (at === null || now + clockOffset < at) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-sm text-(--muted)">{t.skipText}</p>
      <button type="button" className={secondaryButtonClass} disabled={busy} onClick={onSkip}>
        {t.skipButton}
      </button>
    </div>
  );
}

export function NameList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul className={cn('grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {children}
    </ul>
  );
}

export const inputClass =
  'h-14 w-full rounded-xl border border-white/25 bg-transparent px-4 text-lg text-white placeholder:text-white/40 outline-none focus-visible:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const NAME_KEY = 'ww-name';

export function readStoredName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function storeName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name.trim());
  } catch {}
}
