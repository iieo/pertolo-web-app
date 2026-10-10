'use client';

import { useEffect, useState } from 'react';

import { useDrinkGame } from '../game-provider';
import { KIND_COLORS } from '../palette';
import { plainText, toSegments } from '../template';
import { bodySize, CardSurface, Kicker, RichText } from './card-surface';
import { type CardProps, useCardTemplate } from './cards';

const COUNT_SIZE = 'clamp(6rem, min(36vw, 26dvh), 16rem)';
const DONE_SIZE = 'clamp(3rem, min(15vw, 12dvh), 8rem)';

function formatTime(seconds: number) {
  if (seconds < 60) return String(seconds);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** Counts down from the moment the card shows. At zero the card turns red. */
export function TimerCard({ card }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);
  const total = card.seconds ?? 0;
  const [remaining, setRemaining] = useState(total);

  useEffect(() => {
    const end = performance.now() + total * 1000;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((end - performance.now()) / 1000));
      setRemaining(left);
      if (left === 0) window.clearInterval(id);
    }, 100);
    return () => window.clearInterval(id);
  }, [total]);

  const done = remaining === 0;

  return (
    <CardSurface
      color={done ? KIND_COLORS.timeUp : KIND_COLORS.timer}
      label={`${t.cards.timer}, ${t.cards.seconds(total)}. ${text}`}
      announce={done ? t.cards.timeUp : ''}
    >
      <Kicker>{t.cards.timer}</Kicker>
      <RichText segments={segments} size={bodySize(text.length, 0.7)} />
      {/* Fixed height, so the text above does not jump when the count turns into "time's up". */}
      <span
        aria-hidden
        className="flex items-end"
        style={{ minHeight: `calc(${COUNT_SIZE} * 0.85)` }}
      >
        <span
          className="block font-black tracking-tighter tabular-nums"
          style={{ fontSize: done ? DONE_SIZE : COUNT_SIZE, lineHeight: 0.85 }}
        >
          {done ? t.cards.timeUp : formatTime(remaining)}
        </span>
      </span>
    </CardSurface>
  );
}
