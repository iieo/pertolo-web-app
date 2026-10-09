'use client';

import { Fragment, useState } from 'react';
import { Check } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { CATEGORY_KEYS, MAX_QUESTIONS, MIXED_CATEGORIES } from '../categories';
import { enterFullscreen } from '../fullscreen';
import { useTwoHundredQuestionsGame } from '../game-provider';
import { LOCALES } from '../i18n';
import { categoryColor, type QuestionColor } from '../palette';
import { PageShell, primaryButtonClass, secondaryButtonClass } from './game-shell';

export function SetupPhase() {
  const {
    mixed,
    selectMixed,
    selectedCategories,
    toggleCategory,
    countByCategory,
    availableCount,
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
            className={cn(primaryButtonClass, 'bg-white hover:bg-white/85')}
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
            className="flex min-h-12 items-center rounded-xl px-2 text-base font-medium text-white underline decoration-white/40 underline-offset-4 outline-none hover:decoration-white focus-visible:outline-2 focus-visible:outline-white"
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
        <CategoryTile
          name={t.mixed.name}
          description={t.mixed.description}
          countLabel={t.questionCount(mixedCount)}
          color={categoryColor('mixed')}
          selected={mixed}
          onClick={selectMixed}
        />
        <p className="mt-6 mb-2 text-base font-semibold">{t.chooseIndividually}</p>
        <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          {CATEGORY_KEYS.map((key) => (
            <CategoryTile
              key={key}
              name={t.categories[key].name}
              description={t.categories[key].description}
              countLabel={t.questionCount(countByCategory[key] ?? 0)}
              color={categoryColor(key)}
              selected={!mixed && selectedCategories.includes(key)}
              onClick={() => toggleCategory(key)}
            />
          ))}
        </div>
      </section>

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

function CategoryTile({
  name,
  description,
  countLabel,
  color,
  selected,
  onClick,
}: {
  name: string;
  description: string;
  countLabel: string;
  color: QuestionColor;
  selected: boolean;
  onClick: () => void;
}) {
  // Unselected tiles dim only the background and switch to white text, because dimming the
  // whole tile would drop dark text below WCAG AA on the lighter colors.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex min-h-16 w-full flex-col gap-1 rounded-xl p-4 text-left transition-colors duration-150 outline-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={{
        backgroundColor: selected ? color.bg : `color-mix(in srgb, ${color.bg} 45%, black)`,
        color: selected ? color.fg : '#FFFFFF',
      }}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-base font-semibold wrap-break-word hyphens-auto">{name}</span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden>
          {selected && <Check size={20} strokeWidth={3} />}
        </span>
      </span>
      <span className="text-sm leading-snug wrap-break-word hyphens-auto">{description}</span>
      <span className="mt-auto pt-2 text-sm font-medium tabular-nums">{countLabel}</span>
    </button>
  );
}
