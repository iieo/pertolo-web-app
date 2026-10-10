'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { exitFullscreen } from '../fullscreen';
import { useWouldYouRatherGame } from '../game-provider';

const buttonBase =
  'w-full min-h-14 px-6 rounded-xl text-base font-semibold flex items-center justify-center transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40 disabled:pointer-events-none';

export const primaryButtonClass = cn(buttonBase, 'bg-white text-black hover:bg-white/85');
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

export function GameHeader({ color }: { color: string }) {
  const { backToSetup, locale, t } = useWouldYouRatherGame();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20" style={{ color }}>
      <div className="mx-auto flex w-full max-w-2xl items-center px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
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
