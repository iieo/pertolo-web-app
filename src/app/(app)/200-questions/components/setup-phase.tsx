'use client';

import { Fragment, useState } from 'react';
import { Check } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import { CATEGORY_KEYS, MAX_QUESTIONS, MIXED_CATEGORIES } from '../categories';
import { enterFullscreen } from '../fullscreen';
import { useTwoHundredQuestionsGame } from '../game-provider';
import { LOCALES } from '../i18n';
import { PageShell, primaryButtonClass, secondaryButtonClass } from './game-shell';

export function SetupPhase() {
  const {
    mixed,
    selectMixed,
    selectedCategories,
    toggleCategory,
    countByCategory,
    availableCount,
    drinkEnabled,
    setDrinkEnabled,
    startGame,
    locale,
    setLocale,
    t,
  } = useTwoHundredQuestionsGame();
  const [rulesOpen, setRulesOpen] = useState(false);

  const roundSize = Math.min(availableCount, MAX_QUESTIONS);
  const mixedCount = MIXED_CATEGORIES.reduce((sum, key) => sum + (countByCategory[key] ?? 0), 0);

  return (
    <PageShell
      footer={
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-white/60 tabular-nums">
            {availableCount === 0 ? t.selectAtLeastOne : t.questionsPerRound(roundSize)}
          </p>
          <button
            type="button"
            className={primaryButtonClass}
            disabled={availableCount === 0}
            onClick={() => {
              enterFullscreen();
              startGame();
            }}
          >
            {t.start}
          </button>
        </div>
      }
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold tracking-tight">200 Questions</h1>
          <p className="mt-2 text-base leading-relaxed text-white/60">{t.subtitle}</p>
        </div>
        <div className="-mr-2 flex shrink-0 flex-col items-end">
          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            className="flex min-h-12 items-center rounded-xl px-2 text-base font-medium text-sky-400 outline-none hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-white"
          >
            {t.rules}
          </button>
          <div role="group" aria-label={t.language} className="flex items-center text-sm">
            {LOCALES.map((option, i) => (
              <Fragment key={option}>
                {i > 0 && (
                  <span className="text-white/40" aria-hidden>
                    /
                  </span>
                )}
                <button
                  type="button"
                  lang={option}
                  onClick={() => setLocale(option)}
                  aria-pressed={locale === option}
                  className={cn(
                    'flex min-h-12 min-w-10 items-center justify-center rounded-xl px-2 outline-none transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-white',
                    locale === option
                      ? 'font-semibold text-white'
                      : 'font-medium text-white/40 hover:text-white/70',
                  )}
                >
                  {option.toUpperCase()}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-12 flex flex-col gap-2" aria-label={t.categoriesLabel}>
        <CategoryRow
          name={t.mixed.name}
          description={t.mixed.description}
          countLabel={t.questionCount(mixedCount)}
          selected={mixed}
          onClick={selectMixed}
        />
        <p className="mt-6 mb-2 text-base font-semibold">{t.chooseIndividually}</p>
        {CATEGORY_KEYS.map((key) => (
          <CategoryRow
            key={key}
            name={t.categories[key].name}
            description={t.categories[key].description}
            countLabel={t.questionCount(countByCategory[key] ?? 0)}
            selected={!mixed && selectedCategories.includes(key)}
            onClick={() => toggleCategory(key)}
          />
        ))}
      </section>

      <label className="mt-12 flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-4">
        <span className="min-w-0">
          <span className="block text-base font-semibold">{t.drinkTitle}</span>
          <span className="block text-base leading-relaxed text-white/60">
            {t.drinkDescription}
          </span>
        </span>
        <Switch
          checked={drinkEnabled}
          onCheckedChange={setDrinkEnabled}
          className="focus-visible:ring-white focus-visible:ring-offset-black data-[state=checked]:bg-sky-400 data-[state=unchecked]:bg-white/20"
        />
      </label>

      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
        <DialogContent
          lang={locale}
          className="max-h-[90dvh] max-w-[calc(100%-2rem)] gap-8 overflow-y-auto rounded-xl border border-white/10 bg-neutral-950 p-6 text-white sm:max-w-md"
        >
          <DialogHeader className="text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold text-white">{t.rulesTitle}</DialogTitle>
          </DialogHeader>
          <ol className="flex list-decimal flex-col gap-4 pl-6 text-base leading-relaxed text-white/80">
            {t.rulesList.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => setRulesOpen(false)}
          >
            {t.rulesConfirm}
          </button>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function CategoryRow({
  name,
  description,
  countLabel,
  selected,
  onClick,
}: {
  name: string;
  description: string;
  countLabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex min-h-16 w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition-colors duration-150 outline-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        selected ? 'border-sky-400 bg-sky-400/10' : 'border-white/10 hover:bg-white/5',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold wrap-break-word">{name}</span>
        <span className="block text-base leading-relaxed text-white/60 wrap-break-word">
          {description}
        </span>
        <span className="mt-1 block text-sm text-white/60 tabular-nums">{countLabel}</span>
      </span>
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-sky-400 bg-sky-400 text-black' : 'border-white/20',
        )}
        aria-hidden
      >
        {selected && <Check size={16} strokeWidth={3} />}
      </span>
    </button>
  );
}
