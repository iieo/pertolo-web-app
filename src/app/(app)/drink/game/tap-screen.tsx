'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import {
  primaryButtonClass,
  secondaryButtonClass,
} from '@/app/(app)/200-questions/components/game-shell';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const TAP_LOCK_MS = 300;

export function TapScreen({
  color,
  advanceKey,
  onAdvance,
  onQuit,
  children,
}: {
  color: { bg: string; fg: string };
  advanceKey: number;
  onAdvance: () => void;
  onQuit: () => void;
  children: React.ReactNode;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lockedUntil = useRef(Infinity);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // A short lock after every card keeps a double tap from skipping a task unseen.
  useEffect(() => {
    lockedUntil.current = performance.now() + TAP_LOCK_MS;
    buttonRef.current?.focus({ preventScroll: true });
  }, [advanceKey]);

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
        <span className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center px-6 pt-[calc(env(safe-area-inset-top)+4rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
          <span className="sr-only">Tippen für die nächste Aufgabe</span>
        </span>
      </button>

      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="mx-auto flex w-full max-w-2xl items-center px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="pointer-events-auto flex min-h-12 items-center gap-2 rounded-xl px-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-current"
          >
            <X size={20} aria-hidden />
            Beenden
          </button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-8 rounded-xl border border-white/10 bg-neutral-950 p-6 text-white sm:max-w-sm">
          <DialogHeader className="gap-2 text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold text-white">Spiel beenden?</DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-white/60">
              Die Runde endet und ihr könnt eine neue Kategorie wählen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                setConfirmOpen(false);
                onQuit();
              }}
            >
              Beenden
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => setConfirmOpen(false)}
            >
              Weiterspielen
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
