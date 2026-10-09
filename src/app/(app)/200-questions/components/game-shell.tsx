'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Maximize, Minimize, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import {
  enterFullscreen,
  exitFullscreen,
  getFullscreenElement,
  isFullscreenSupported,
} from '../fullscreen';
import { useTwoHundredQuestionsGame } from '../game-provider';

const TAP_LOCK_MS = 300;

const buttonBase =
  'w-full min-h-14 px-6 rounded-xl text-base font-semibold flex items-center justify-center transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40 disabled:pointer-events-none';

export const primaryButtonClass = cn(buttonBase, 'bg-sky-400 text-black hover:bg-sky-300');
export const secondaryButtonClass = cn(
  buttonBase,
  'border border-white/20 text-white hover:bg-white/10',
);

export function PageShell({
  footer,
  children,
}: {
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-black text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 pt-[max(3rem,env(safe-area-inset-top))]">
        <main className="flex flex-1 flex-col pb-12">{children}</main>
        {footer && (
          <div className="sticky bottom-0 -mx-6 bg-black px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function questionFontSize(length: number) {
  if (length <= 40) return 'clamp(2.25rem, min(11vw, 7dvh), 4.5rem)';
  if (length <= 80) return 'clamp(1.875rem, min(8.5vw, 5.5dvh), 3.5rem)';
  if (length <= 120) return 'clamp(1.5rem, min(7.5vw, 4.75dvh), 3rem)';
  return 'clamp(1.375rem, min(6.5vw, 4dvh), 2.5rem)';
}

export function QuestionText({ text }: { text: string }) {
  return (
    <span
      className="block font-bold tracking-tight text-pretty wrap-break-word hyphens-auto"
      style={{ fontSize: questionFontSize(text.length), lineHeight: 1.15 }}
    >
      {text}
    </span>
  );
}

export function TapScreen({
  color,
  hint,
  onAdvance,
  children,
}: {
  color: { bg: string; fg: string };
  hint: string;
  onAdvance: () => void;
  children: React.ReactNode;
}) {
  const { phase, currentIndex } = useTwoHundredQuestionsGame();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lockedUntil = useRef(Infinity);

  useEffect(() => {
    lockedUntil.current = performance.now() + TAP_LOCK_MS;
    buttonRef.current?.focus({ preventScroll: true });
  }, [phase, currentIndex]);

  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevOverscroll = html.style.overscrollBehavior;
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    return () => {
      html.style.overflow = prevOverflow;
      html.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const prev = meta.content;
    meta.content = color.bg;
    return () => {
      meta.content = prev;
    };
  }, [color.bg]);

  const handleClick = () => {
    if (performance.now() < lockedUntil.current) return;
    lockedUntil.current = Infinity;
    onAdvance();
  };

  return (
    <div
      className="fixed inset-0 h-dvh overflow-hidden overscroll-none select-none touch-manipulation transition-colors duration-150 motion-reduce:transition-none"
      style={{ backgroundColor: color.bg, color: color.fg }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className="absolute inset-0 block h-full w-full cursor-pointer text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
      >
        <span className="mx-auto flex h-full w-full max-w-2xl flex-col px-6 pt-[calc(env(safe-area-inset-top)+4rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <span className="flex min-h-0 flex-1 flex-col justify-center gap-6">{children}</span>
          <span className="block pt-6 text-sm">{hint}</span>
        </span>
      </button>
      <GameHeader />
    </div>
  );
}

function subscribeFullscreen(onChange: () => void) {
  document.addEventListener('fullscreenchange', onChange);
  document.addEventListener('webkitfullscreenchange', onChange);
  return () => {
    document.removeEventListener('fullscreenchange', onChange);
    document.removeEventListener('webkitfullscreenchange', onChange);
  };
}

function FullscreenToggle() {
  const { t } = useTwoHundredQuestionsGame();
  const supported = useSyncExternalStore(subscribeFullscreen, isFullscreenSupported, () => false);
  const active = useSyncExternalStore(
    subscribeFullscreen,
    () => getFullscreenElement() !== null,
    () => false,
  );
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (active) exitFullscreen();
        else enterFullscreen();
      }}
      className="pointer-events-auto -mr-2 flex min-h-12 min-w-12 items-center justify-center rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-current"
      aria-label={active ? t.fullscreenExit : t.fullscreenEnter}
    >
      {active ? <Minimize size={20} /> : <Maximize size={20} />}
    </button>
  );
}

function GameHeader() {
  const { currentIndex, deck, backToSetup, locale, t } = useTwoHundredQuestionsGame();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          className="pointer-events-auto flex min-h-12 items-center gap-2 rounded-xl px-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-current"
        >
          <X size={20} aria-hidden />
          {t.quit}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums">
            {currentIndex + 1} / {deck.length}
          </span>
          <FullscreenToggle />
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          lang={locale}
          className="max-w-[calc(100%-2rem)] gap-8 rounded-xl border border-white/10 bg-neutral-950 p-6 text-white sm:max-w-sm"
        >
          <DialogHeader className="gap-2 text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold text-white">{t.quitTitle}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-white/60">
              {t.quitDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                setConfirmOpen(false);
                exitFullscreen();
                backToSetup();
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
