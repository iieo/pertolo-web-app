import { cn } from '@/lib/utils';

// Light green from the Bet tile family. Black text on it and it as text on black both clear AA.
export const ACCENT = '#52B788';

const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const buttonBase = cn(
  'flex min-h-14 w-full items-center justify-center rounded-xl px-6 text-base font-semibold transition-colors duration-150 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40',
  focusRing,
);

export const primaryButtonClass = cn(buttonBase, 'bg-[#52B788] text-black hover:bg-[#52B788]/85');
export const secondaryButtonClass = cn(
  buttonBase,
  'border border-white/20 text-white hover:bg-white/10',
);

export const smallButtonClass = cn(
  'flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-4 text-base font-medium text-white transition-colors duration-150 hover:bg-white/10 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40',
  focusRing,
);

export const inputClass =
  'block h-14 w-full min-w-0 rounded-xl border border-white/20 bg-transparent px-4 text-base text-white transition-colors duration-150 outline-none placeholder:text-white/40 hover:border-white/40 focus-visible:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none';

export const labelClass = 'block text-base font-semibold text-white';
export const hintClass = 'text-sm leading-relaxed text-white/60';
export const errorClass = 'text-sm text-[#FF8A8A]';

export const pageTitleClass = 'text-4xl font-bold tracking-tight md:text-5xl';
export const sectionTitleClass = 'text-xl font-semibold md:text-2xl';

export const pageClass = 'mx-auto w-full pt-[max(3rem,env(safe-area-inset-top))] md:pt-16 lg:pt-24';

export function choiceTileClass(selected: boolean) {
  return cn(
    'flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-base transition-colors duration-150 motion-reduce:transition-none',
    focusRing,
    selected
      ? 'border-[#52B788] bg-[#52B788] font-semibold text-black'
      : 'border-white/20 text-white hover:bg-white/10',
  );
}

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#0A0A0A',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '14px',
  },
  itemStyle: { color: '#FFFFFF' },
  labelStyle: { color: 'rgba(255,255,255,0.6)', marginBottom: '4px' },
};

export const STATUS_LABEL = {
  open: 'Offen',
  resolved: 'Beendet',
  cancelled: 'Storniert',
} as const;
