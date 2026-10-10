'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

import { useDrinkGame } from '../game-provider';
import { KIND_COLORS } from '../palette';
import { plainText, toSegments } from '../template';
import { bodySize, CardSurface, heroClass, Kicker, nameSize, RichText } from './card-surface';
import { type CardProps, TaskCard, useCardTemplate } from './cards';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const STEPS = 18;

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
}

// Random names without direct repeats, landing on the chosen one.
function spinSequence(players: readonly string[], chosen: string) {
  const sequence: string[] = [];
  let previous = chosen;
  for (let i = 0; i < STEPS - 1; i++) {
    const options = players.filter((p) => p !== previous);
    previous = options[Math.floor(Math.random() * options.length)] ?? chosen;
    sequence.push(previous);
  }
  if (sequence.at(-1) === chosen) sequence.pop();
  sequence.push(chosen);
  return sequence;
}

/** Names flicker through and slow down until they land on the chosen player. */
export function RouletteCard({ card, index }: CardProps) {
  const { players, t } = useDrinkGame();
  const template = useCardTemplate(card);
  const chosen = card.names[0];
  if (!chosen || !players || players.length < 2) {
    return <TaskCard card={card} index={index} kicker={t.cards.roulette} />;
  }
  return (
    <Roulette card={card} index={index} chosen={chosen} players={players} template={template} />
  );
}

function Roulette({
  card,
  chosen,
  players,
  template,
}: CardProps & { chosen: string; players: string[]; template: string }) {
  const { t } = useDrinkGame();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<{ name: string; landed: boolean } | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const sequence = spinSequence(players, chosen);
    const timers: number[] = [];
    let at = 0;
    sequence.forEach((name, i) => {
      // Ease out: steps start at 50ms and stretch to about 320ms.
      at += 50 + 270 * (i / (sequence.length - 1)) ** 2;
      timers.push(
        window.setTimeout(() => setStep({ name, landed: i === sequence.length - 1 }), at),
      );
    });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reducedMotion, players, chosen]);

  const landed = reducedMotion || (step?.landed ?? false);
  const shown = reducedMotion ? chosen : (step?.name ?? players[0]!);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);
  const longest = Math.max(...players.map((p) => p.length));

  return (
    <CardSurface
      color={KIND_COLORS.roulette}
      label={`${t.cards.roulette}. ${text}`}
      announce={landed ? t.cards.rouletteResult(chosen) : t.cards.rouletteSpinning}
    >
      <span className="flex flex-col gap-2">
        <Kicker>{t.cards.roulette}</Kicker>
        {/* Sized for the longest name, so the flicker never reflows the card. */}
        <span aria-hidden className={heroClass} style={{ fontSize: nameSize(longest) }}>
          {shown}
        </span>
      </span>
      <span
        className={cn(
          'block transition-opacity duration-300 motion-reduce:transition-none',
          landed ? 'opacity-100' : 'opacity-0',
        )}
      >
        <RichText segments={segments} size={bodySize(text.length, 0.75)} />
      </span>
    </CardSurface>
  );
}
