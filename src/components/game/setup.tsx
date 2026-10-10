'use client';

import { useId, useRef, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { LOCALES, type Locale } from './locale';
import { dialogContentClass, focusRingClass, secondaryButtonClass } from './page-shell';
import { type GameColor, shade } from './palette';

const pressClass =
  'transition-[background-color,color,outline-color,transform] duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100';

/**
 * Setup page layout: big title, the category tiles as the hero, one compact settings block and a
 * Start footer that sticks to the bottom on phones and sits inline from md up.
 */
export function SetupScreen({
  title,
  subtitle,
  rules,
  settings,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  rules?: React.ReactNode;
  settings?: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-black pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] text-white sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] md:pr-[max(2rem,env(safe-area-inset-right))] md:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(3rem,env(safe-area-inset-right))] lg:pl-[max(3rem,env(safe-area-inset-left))]">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col pt-[calc(env(safe-area-inset-top)+3rem)] md:pt-[calc(env(safe-area-inset-top)+4rem)] lg:pt-[calc(env(safe-area-inset-top)+6rem)]">
        <header className="flex flex-col items-start gap-4 md:gap-6">
          <h1 className="max-w-full text-5xl leading-[0.95] font-bold tracking-tight text-balance wrap-break-word md:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-snug text-white/60 md:text-2xl">{subtitle}</p>
          {rules && <div className="-ml-2">{rules}</div>}
        </header>

        <main className="mt-12 flex flex-1 flex-col gap-12 pb-8 md:mt-16 md:gap-16 md:pb-12">
          {children}
          {settings}
        </main>

        <div className="sticky bottom-0 z-10 bg-black pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:pt-0 md:pb-[max(4rem,env(safe-area-inset-bottom))] lg:pb-[max(6rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      </div>
    </div>
  );
}

export type CategoryOption<K extends string> = {
  key: K;
  name: string;
  description: string;
  /** Plain text such as "42 questions". Left out when it adds nothing. */
  count?: string;
  color: GameColor;
};

/**
 * Mixed comes first as a full-width tile and is exclusive with the single picks. The selection
 * logic lives in the caller (see useCategorySelection).
 */
export function CategoryGrid<K extends string>({
  label,
  mixed,
  mixedSelected,
  onSelectMixed,
  individuallyLabel,
  categories,
  selected,
  onToggle,
}: {
  label: string;
  mixed: Omit<CategoryOption<string>, 'key'>;
  mixedSelected: boolean;
  onSelectMixed: () => void;
  individuallyLabel: string;
  categories: CategoryOption<K>[];
  selected: readonly K[];
  onToggle: (key: K) => void;
}) {
  const individuallyId = useId();

  return (
    <section aria-label={label} className="flex flex-col">
      <CategoryTile {...mixed} featured selected={mixedSelected} onClick={onSelectMixed} />
      <h2
        id={individuallyId}
        className="mt-8 mb-4 text-base font-semibold text-white/60 md:mt-12 md:mb-6 md:text-lg"
      >
        {individuallyLabel}
      </h2>
      <div
        role="group"
        aria-labelledby={individuallyId}
        className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
      >
        {categories.map((category) => (
          <CategoryTile
            key={category.key}
            name={category.name}
            description={category.description}
            count={category.count}
            color={category.color}
            selected={!mixedSelected && selected.includes(category.key)}
            onClick={() => onToggle(category.key)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Solid color tile. Selected tiles get a white outline in the black gap around them, unselected
 * tiles are darkened a little. Text color is recomputed for the darker shade, so it stays AA.
 * Focus shows as an inner frame, so it never competes with the selection outline.
 */
export function CategoryTile({
  name,
  description,
  count,
  color,
  selected,
  onClick,
  featured = false,
}: {
  name: string;
  description?: string;
  count?: string;
  color: GameColor;
  selected: boolean;
  onClick: () => void;
  featured?: boolean;
}) {
  const shown = selected ? color : shade(color);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group relative flex h-full w-full flex-col items-start rounded-xl p-4 text-left outline-3 outline-offset-3 outline-solid touch-manipulation md:p-6',
        pressClass,
        featured ? 'min-h-32 md:min-h-40' : 'min-h-24 md:min-h-32',
        selected ? 'outline-white' : 'outline-transparent hover:outline-white/40',
      )}
      style={{ backgroundColor: shown.bg, color: shown.fg }}
    >
      <span
        className={cn(
          'max-w-full leading-tight font-bold tracking-tight wrap-break-word hyphens-auto',
          featured ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl',
        )}
      >
        {name}
      </span>
      {description && (
        <span
          className={cn(
            'mt-1 max-w-full leading-snug wrap-break-word hyphens-auto',
            featured ? 'text-base md:mt-2 md:text-lg' : 'text-sm md:text-base',
          )}
        >
          {description}
        </span>
      )}
      {count && (
        <span className="mt-auto pt-4 text-sm font-medium tabular-nums md:text-base">{count}</span>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-lg border-2 border-current opacity-0 group-focus-visible:opacity-100"
      />
    </button>
  );
}

/** One plain block for every setting row (language, timer, fuse, sound). */
export function SettingsSection({ children }: { children: React.ReactNode }) {
  return <div className="grid border-t border-white/15 md:grid-cols-2 md:gap-x-12">{children}</div>;
}

const ARROW_STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/** A labelled radio group row. Arrow keys move the selection, as in native radio groups. */
export function SegmentedControl<T extends string>({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  /** Plain text under the label. */
  description?: string;
  value: T;
  options: readonly { value: T; label: string; lang?: string }[];
  onChange: (value: T) => void;
}) {
  const labelId = useId();
  const descriptionId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const step = ARROW_STEPS[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next]!.value);
    buttons.current[next]?.focus();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/15 py-4">
      {description ? (
        <div className="flex min-w-0 flex-col gap-1">
          <span id={labelId} className="text-base font-semibold md:text-lg">
            {label}
          </span>
          <span id={descriptionId} className="text-sm leading-snug text-white/60 md:text-base">
            {description}
          </span>
        </div>
      ) : (
        <span id={labelId} className="text-base font-semibold md:text-lg">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        className="flex gap-1"
      >
        {options.map((option, index) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttons.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              lang={option.lang}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                'flex min-h-11 min-w-11 items-center justify-center rounded-lg px-4 text-base font-semibold tabular-nums transition-colors duration-150 motion-reduce:transition-none',
                focusRingClass,
                selected ? 'bg-white text-black' : 'text-white/60 hover:text-white',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const LANGUAGE_OPTIONS = LOCALES.map((locale) => ({
  value: locale,
  label: locale.toUpperCase(),
  lang: locale,
}));

export function LanguageToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <SegmentedControl label={label} value={value} options={LANGUAGE_OPTIONS} onChange={onChange} />
  );
}

/** `detail` is plain text next to the label, e.g. "200 questions per round". */
export function StartButton({
  label,
  detail,
  disabled = false,
  onClick,
}: {
  label: string;
  detail?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex min-h-14 w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl bg-white px-6 py-4 text-left text-black hover:bg-white/85 disabled:pointer-events-none disabled:bg-neutral-800 disabled:text-white/60 md:max-w-md',
        focusRingClass,
        pressClass,
      )}
    >
      <span className="text-lg font-bold md:text-xl">{label}</span>
      {detail && <span className="text-base font-medium tabular-nums">{detail}</span>}
    </button>
  );
}

export function RulesLink({
  label,
  title,
  rules,
  confirmLabel,
  lang,
}: {
  label: string;
  title: string;
  rules: readonly string[];
  confirmLabel: string;
  lang: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex min-h-11 items-center rounded-lg px-2 text-base font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white md:text-lg',
          focusRingClass,
        )}
      >
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent lang={lang} className={cn(dialogContentClass, 'sm:max-w-md')}>
          <DialogHeader className="pr-12 text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold text-white">{title}</DialogTitle>
          </DialogHeader>
          <ol className="flex list-decimal flex-col gap-4 pl-6 text-base leading-relaxed text-white/80">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <button type="button" className={secondaryButtonClass} onClick={() => setOpen(false)}>
            {confirmLabel}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
