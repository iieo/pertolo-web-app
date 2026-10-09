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

import { CATEGORY_BY_KEY } from '../categories';
import { useTwoHundredQuestionsGame } from '../game-provider';
import { CategoryKey } from '../types';

export function PhaseShell({
  gradient,
  header,
  footer,
  children,
}: {
  gradient: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh w-full bg-black flex flex-col overflow-x-hidden md:max-w-lg md:mx-auto">
      <div className={cn('fixed inset-0 bg-linear-to-br pointer-events-none', gradient)} />

      <div className="relative flex flex-col flex-1 min-w-0 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        {header}
        <main className="flex-1 flex flex-col items-center justify-center gap-6 py-6 min-w-0">
          {children}
        </main>
        {footer && (
          <div className="sticky bottom-0 -mx-4 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-linear-to-t from-black via-black/85 to-transparent">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

const glowVariants = {
  sky: 'bg-sky-600 hover:bg-sky-500 border-sky-500/50 shadow-[0_0_40px_-4px_rgba(14,165,233,0.6)]',
  ghost: 'bg-white/10 hover:bg-white/15 border-white/20',
};

export function GlowButton({
  variant = 'sky',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof glowVariants }) {
  return (
    <button
      className={cn(
        'w-full min-h-14 py-5 px-4 rounded-2xl border font-black text-white text-xl tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none',
        glowVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function CategoryBadge({ category }: { category: CategoryKey }) {
  const meta = CATEGORY_BY_KEY[category];
  return (
    <div className="max-w-full px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
      <span className="text-white/80 text-xs font-bold tracking-widest uppercase">
        {meta.emoji} {meta.name}
      </span>
    </div>
  );
}

function questionFontSize(length: number) {
  if (length > 140) return 'clamp(1.2rem, 5.2vw, 1.85rem)';
  if (length > 90) return 'clamp(1.35rem, 6vw, 2.25rem)';
  if (length > 50) return 'clamp(1.6rem, 7vw, 2.75rem)';
  return 'clamp(1.85rem, 8.5vw, 3.25rem)';
}

export function QuestionText({ text }: { text: string }) {
  return (
    <h2
      className="w-full text-center text-white font-black tracking-tight wrap-break-word hyphens-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      style={{ fontSize: questionFontSize(text.length), lineHeight: 1.2 }}
      lang="de"
    >
      {text}
    </h2>
  );
}

export function GameHeader() {
  const { currentIndex, deck, backToSetup } = useTwoHundredQuestionsGame();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const progress = deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0;

  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setConfirmOpen(true)}
          className="min-h-12 min-w-12 px-3 -ml-1 rounded-full flex items-center justify-center gap-1.5 text-white/60 text-sm font-semibold hover:text-white hover:bg-white/10 transition-colors active:scale-95"
          aria-label="Spiel beenden"
        >
          <X size={20} />
          <span>Beenden</span>
        </button>
        <span className="text-white/60 text-sm font-bold tabular-nums">
          Frage {currentIndex + 1} / {deck.length}
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-sky-400 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-[#0e0e14] border border-white/10 text-white rounded-3xl max-w-[calc(100%-2rem)] sm:max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-black text-center">
              Spiel beenden?
            </DialogTitle>
            <DialogDescription className="text-white/60 text-center">
              Ihr landet wieder in der Auswahl. Der Fortschritt dieser Runde geht verloren.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <GlowButton
              variant="sky"
              className="text-base py-4"
              onClick={() => {
                setConfirmOpen(false);
                backToSetup();
              }}
            >
              Beenden
            </GlowButton>
            <GlowButton
              variant="ghost"
              className="text-base py-4"
              onClick={() => setConfirmOpen(false)}
            >
              Weiterspielen
            </GlowButton>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
