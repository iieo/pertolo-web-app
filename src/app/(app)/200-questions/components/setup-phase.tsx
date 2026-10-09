'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import { CATEGORIES, MAX_QUESTIONS, MIXED } from '../categories';
import { useTwoHundredQuestionsGame } from '../game-provider';
import { GlowButton, PhaseShell } from './game-shell';

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
  } = useTwoHundredQuestionsGame();
  const [rulesOpen, setRulesOpen] = useState(false);

  const roundSize = Math.min(availableCount, MAX_QUESTIONS);

  return (
    <PhaseShell
      gradient="from-sky-950 via-black to-indigo-950"
      header={
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-white font-black tracking-tight text-[clamp(2rem,10vw,3rem)] leading-none drop-shadow-[0_0_20px_rgba(14,165,233,0.4)]">
              200 Questions
            </h1>
            <p className="text-white/50 text-sm mt-2">Auf wen trifft es am meisten zu?</p>
          </div>
          <button
            onClick={() => setRulesOpen(true)}
            className="shrink-0 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-lg hover:bg-white/20 transition-colors active:scale-95"
            aria-label="Spielregeln"
          >
            ?
          </button>
        </header>
      }
      footer={
        <>
          <p className="text-center text-white/50 text-sm mb-3 tabular-nums">
            {availableCount === 0
              ? 'Wähle mindestens eine Kategorie'
              : `${availableCount} Fragen verfügbar, ${roundSize} pro Runde`}
          </p>
          <GlowButton onClick={startGame} disabled={availableCount === 0}>
            Starten
          </GlowButton>
        </>
      }
    >
      <div className="w-full grid grid-cols-2 gap-3">
        <CategoryCard
          className="col-span-2"
          emoji={MIXED.emoji}
          name={MIXED.name}
          description={MIXED.description}
          selected={mixed}
          onClick={selectMixed}
        />
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.key}
            emoji={category.emoji}
            name={category.name}
            description={category.description}
            count={countByCategory[category.key] ?? 0}
            selected={!mixed && selectedCategories.includes(category.key)}
            onClick={() => toggleCategory(category.key)}
          />
        ))}
      </div>

      <label className="w-full min-h-16 flex items-center justify-between gap-4 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 cursor-pointer">
        <span className="min-w-0">
          <span className="block text-white font-bold">🍺 Strafschluck</span>
          <span className="block text-white/50 text-sm">
            Wer die Frage bekommt, trinkt einen Schluck
          </span>
        </span>
        <Switch
          checked={drinkEnabled}
          onCheckedChange={setDrinkEnabled}
          className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-white/20"
        />
      </label>

      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
        <DialogContent className="bg-[#0e0e14] border border-white/10 text-white rounded-3xl max-w-[calc(100%-2rem)] sm:max-w-sm p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-black text-center">
              Spielregeln
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <RuleStep number="1">
              Wer das Handy hat, liest die Frage still. Niemand sonst darf mitlesen.
            </RuleStep>
            <RuleStep number="2">
              Überleg dir, auf wen in der Gruppe die Frage am besten zutrifft.
            </RuleStep>
            <RuleStep number="3">
              Tippe auf <strong>&quot;Weitergeben&quot;</strong> und gib das Handy verdeckt an diese
              Person.
            </RuleStep>
            <RuleStep number="4">
              Die Person deckt auf und liest die Frage laut vor. Mit Strafschluck trinkt sie einen
              Schluck.
            </RuleStep>
            <RuleStep number="5">
              Danach liest sie still die nächste Frage und das Spiel geht weiter.
            </RuleStep>
          </div>

          <GlowButton className="mt-4 text-base py-4" onClick={() => setRulesOpen(false)}>
            Verstanden!
          </GlowButton>
        </DialogContent>
      </Dialog>
    </PhaseShell>
  );
}

function CategoryCard({
  emoji,
  name,
  description,
  count,
  selected,
  onClick,
  className,
}: {
  emoji: string;
  name: string;
  description: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'relative min-w-0 min-h-28 flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all active:scale-[0.97]',
        selected
          ? 'bg-sky-500/20 border-sky-400/70 shadow-[0_0_24px_-6px_rgba(14,165,233,0.6)]'
          : 'bg-white/5 border-white/10 hover:bg-white/10',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-2.5 right-2.5 w-6 h-6 rounded-full border flex items-center justify-center transition-colors',
          selected ? 'bg-sky-500 border-sky-400 text-white' : 'border-white/20 text-transparent',
        )}
      >
        <Check size={14} strokeWidth={3} />
      </span>
      <span className="text-3xl leading-none">{emoji}</span>
      <span className="text-white font-bold leading-tight pr-7 wrap-break-word">{name}</span>
      <span className="text-white/50 text-xs leading-snug wrap-break-word">{description}</span>
      {count !== undefined && (
        <span className="mt-auto pt-1 text-white/30 text-xs tabular-nums">{count} Fragen</span>
      )}
    </button>
  );
}

function RuleStep({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="min-w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white font-black text-sm shrink-0">
        {number}
      </span>
      <p className="text-white/80 text-sm leading-relaxed pt-0.5">{children}</p>
    </div>
  );
}
