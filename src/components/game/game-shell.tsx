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

import { exitFullscreen } from './fullscreen';
import { useScrollLock, useThemeColor } from './hooks';
import { dialogContentClass, primaryButtonClass, secondaryButtonClass } from './page-shell';
import type { GameColor } from './palette';

export type QuitLabels = {
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
};

/**
 * Fullscreen game surface that never scrolls. Syncs the theme-color meta and renders the Quit
 * button, which inherits the surface text color, with its confirm dialog.
 */
export function GameShell({
  color,
  themeColor = color.bg,
  lang,
  labels,
  onQuit,
  showQuit = true,
  className,
  surfaceRef,
  children,
}: {
  color: GameColor;
  themeColor?: string;
  lang: string;
  labels: QuitLabels;
  /** Runs after fullscreen was exited. */
  onQuit: () => void;
  showQuit?: boolean;
  className?: string;
  surfaceRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  useScrollLock();
  useThemeColor(themeColor);

  return (
    <div
      ref={surfaceRef}
      className={cn(
        'fixed inset-0 h-dvh overflow-hidden overscroll-none select-none touch-manipulation',
        className,
      )}
      style={{ backgroundColor: color.bg, color: color.fg }}
    >
      {children}
      {showQuit && <QuitButton lang={lang} labels={labels} onQuit={onQuit} />}
    </div>
  );
}

function QuitButton({
  lang,
  labels,
  onQuit,
}: {
  lang: string;
  labels: QuitLabels;
  onQuit: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <div className="flex w-full items-center pt-[calc(env(safe-area-inset-top)+0.5rem)] pr-4 pl-[max(1rem,env(safe-area-inset-left))]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          className="pointer-events-auto flex min-h-12 items-center gap-2 rounded-xl px-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-current"
        >
          <X size={20} aria-hidden />
          {labels.quit}
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent lang={lang} className={cn(dialogContentClass, 'sm:max-w-sm')}>
          <DialogHeader className="gap-2 pr-12 text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold text-white">
              {labels.quitTitle}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-white/60">
              {labels.quitDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                setConfirmOpen(false);
                exitFullscreen();
                onQuit();
              }}
            >
              {labels.quit}
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => setConfirmOpen(false)}
            >
              {labels.keepPlaying}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
