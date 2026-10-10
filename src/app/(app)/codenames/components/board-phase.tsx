'use client';

import { useEffect, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useTapGuard } from '@/components/game/hooks';
import { dimmed, type GameColor } from '@/components/game/palette';
import { cn } from '@/lib/utils';

import { displayWord, useCodenamesGame } from '../game-provider';
import { HIDDEN_CARD, ROLE_COLORS, TEAM_COLORS } from '../palette';
import type { Card, Team } from '../types';

const headerButtonClass =
  'pointer-events-auto flex min-h-12 items-center rounded-xl px-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-current sm:px-3 md:text-base';

// Sized against the card itself (size container): long words get smaller and may wrap, the
// block size cap keeps short words from overflowing flat landscape cards.
function wordFontSize(length: number) {
  const inline = Math.min(22, 210 / Math.max(length, 1));
  return `clamp(0.6875rem, min(${inline.toFixed(2)}cqi, 28cqb), 2.5rem)`;
}

function cardStyle(card: Card, armed: boolean, showKey: boolean, turn: Team) {
  let color: GameColor = HIDDEN_CARD;
  if (card.revealed) color = showKey ? dimmed(ROLE_COLORS[card.role]) : ROLE_COLORS[card.role];
  else if (showKey) color = ROLE_COLORS[card.role];

  let boxShadow: string | undefined;
  if (armed && !showKey) boxShadow = `inset 0 0 0 5px ${TEAM_COLORS[turn].bg}`;
  else if (card.role === 'assassin' && (showKey || card.revealed))
    boxShadow = 'inset 0 0 0 2px rgba(255, 255, 255, 0.6)';

  return { backgroundColor: color.bg, color: color.fg, boxShadow };
}

export function BoardPhase() {
  const { cards, turn, armedIndex, tapCard, endTurn, backToSetup, locale, t } = useCodenamesGame();
  const [showKey, setShowKey] = useState(false);
  const revealedCount = cards.filter((card) => card.revealed).length;
  // Every guarded action changes this key, otherwise the guard would stay locked.
  const guarded = useTapGuard(`${turn}-${armedIndex}-${revealedCount}`);

  // Releasing anywhere, even outside the button, hides the key again.
  useEffect(() => {
    if (!showKey) return;
    const hide = () => setShowKey(false);
    window.addEventListener('pointerup', hide);
    window.addEventListener('pointercancel', hide);
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('pointerup', hide);
      window.removeEventListener('pointercancel', hide);
      window.removeEventListener('blur', hide);
    };
  }, [showKey]);

  const team = TEAM_COLORS[turn];

  return (
    <GameShell
      color={team}
      lang={locale}
      labels={t}
      onQuit={backToSetup}
      headerEnd={
        <>
          <button
            type="button"
            aria-label={t.keyLabel}
            aria-pressed={showKey}
            onPointerDown={(e) => {
              e.preventDefault();
              setShowKey(true);
            }}
            onKeyDown={(e) => {
              if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                e.preventDefault();
                setShowKey(true);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') setShowKey(false);
            }}
            onPointerUp={() => setShowKey(false)}
            onBlur={() => setShowKey(false)}
            onContextMenu={(e) => e.preventDefault()}
            className={cn(headerButtonClass, 'touch-none [-webkit-touch-callout:none]')}
          >
            {t.key}
          </button>
          <button
            type="button"
            onClick={guarded(endTurn)}
            className={cn(headerButtonClass, 'whitespace-nowrap')}
          >
            {t.endTurn}
          </button>
        </>
      }
      className="flex flex-col transition-colors duration-300 motion-reduce:transition-none"
    >
      {/* Keeps the board clear of the header overlay. */}
      <div aria-hidden className="h-[calc(env(safe-area-inset-top)+4rem)] shrink-0" />

      <div className="min-h-0 flex-1 bg-black pt-1 pr-[max(0.25rem,env(safe-area-inset-right))] pb-[max(0.25rem,env(safe-area-inset-bottom))] pl-[max(0.25rem,env(safe-area-inset-left))] sm:pt-2 sm:pr-[max(0.5rem,env(safe-area-inset-right))] sm:pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pl-[max(0.5rem,env(safe-area-inset-left))] md:p-4">
        <div
          role="group"
          aria-label={t.boardLabel}
          className="mx-auto grid h-full w-full max-w-6xl grid-cols-5 grid-rows-5 gap-1 sm:gap-2"
        >
          {cards.map((card, index) => {
            const word = displayWord(card, locale);
            const armed = armedIndex === index;
            return (
              <button
                key={card.id}
                type="button"
                aria-disabled={card.revealed || undefined}
                aria-label={
                  card.revealed
                    ? t.revealedCardLabel(word, t.roles[card.role])
                    : armed
                      ? t.armedCardLabel(word)
                      : t.cardLabel(word)
                }
                onClick={() => {
                  if (card.revealed || showKey) return;
                  guarded(() => tapCard(index))();
                }}
                className={cn(
                  'flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-md p-1 text-center leading-[1.1] font-bold [container-type:size] outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:rounded-lg sm:p-2',
                  !card.revealed && !showKey && 'cursor-pointer',
                )}
                style={cardStyle(card, armed, showKey, turn)}
              >
                <span
                  className="max-w-full text-balance wrap-break-word hyphens-auto"
                  style={{ fontSize: wordFontSize(word.length) }}
                >
                  {word}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {t.turnAnnouncement(t.teams[turn])}
      </p>
    </GameShell>
  );
}
