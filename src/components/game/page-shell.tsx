import { cn } from '@/lib/utils';

export const focusRingClass =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const buttonBase = cn(
  'w-full min-h-14 px-6 rounded-xl text-base font-semibold flex items-center justify-center transition-colors duration-150 motion-reduce:transition-none disabled:opacity-40 disabled:pointer-events-none',
  focusRingClass,
);

export const primaryButtonClass = cn(buttonBase, 'bg-white text-black hover:bg-white/85');
export const secondaryButtonClass = cn(
  buttonBase,
  'border border-white/20 text-white hover:bg-white/10',
);

export const dialogContentClass =
  'max-h-[90dvh] max-w-[calc(100%-2rem)] gap-8 overflow-y-auto rounded-xl border border-white/10 bg-neutral-950 p-6 text-white [&>button:last-child]:top-2 [&>button:last-child]:right-2 [&>button:last-child]:flex [&>button:last-child]:size-11 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-xl [&>button:last-child]:bg-transparent [&>button:last-child]:text-white/70';

/** Narrow scrolling page with a footer that sticks to the bottom on phones. */
export function PageShell({
  footer,
  children,
}: {
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-black pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col pt-[max(3rem,env(safe-area-inset-top))] md:justify-center md:pt-[max(4rem,env(safe-area-inset-top))]">
        <main className="flex flex-1 flex-col pb-12 md:flex-none">{children}</main>
        {footer && (
          <div className="sticky bottom-0 bg-black pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:static md:pb-16">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
