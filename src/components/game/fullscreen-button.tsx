'use client';

import { Maximize, Minimize } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  enterFullscreen,
  exitFullscreen,
  useFullscreenSupported,
  useIsFullscreen,
} from './fullscreen';

const LABELS = {
  de: { enter: 'Vollbild', exit: 'Vollbild beenden' },
  en: { enter: 'Full screen', exit: 'Exit full screen' },
};

/** Toggles fullscreen and renders nothing where the browser can't do it. */
export function FullscreenButton({
  lang,
  onEnter,
  className,
}: {
  lang: string;
  /** Runs once fullscreen was entered. */
  onEnter?: () => void;
  className?: string;
}) {
  const supported = useFullscreenSupported();
  const isFullscreen = useIsFullscreen();
  if (!supported) return null;

  const labels = lang.startsWith('de') ? LABELS.de : LABELS.en;
  const Icon = isFullscreen ? Minimize : Maximize;

  return (
    <button
      type="button"
      aria-label={isFullscreen ? labels.exit : labels.enter}
      onClick={(e) => {
        e.stopPropagation();
        if (isFullscreen) exitFullscreen();
        else enterFullscreen().then(onEnter);
      }}
      className={cn(
        'flex min-h-12 min-w-12 items-center justify-center rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-current',
        className,
      )}
    >
      <Icon size={20} aria-hidden />
    </button>
  );
}
