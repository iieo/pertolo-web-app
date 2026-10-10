'use client';

import { useEffect, useRef, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useWakeLock } from '@/components/game/hooks';
import type { Locale } from '@/components/game/locale';
import { shuffle } from '@/components/game/shuffle';
import { cn } from '@/lib/utils';

import { prefersReducedMotion, vibrate } from '../device';
import type { Dictionary } from '../i18n';
import { fingerColor, PICKER_SCREEN, TEAM_COLORS } from '../palette';
import { type PickerSplit, teamCount } from '../types';

const HOLD_MS = 2000;
const CIRCLE_PX = 88;
const RING_PX = 128;
const RING_RADIUS = 58;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const LABEL_OFFSET_PX = 104;
const PICK_VIBRATION_MS = 80;

type Finger = { id: number; x: number; y: number; color: number };

type Result =
  | { kind: 'winner'; id: number; x: number; y: number }
  | { kind: 'teams'; teamOf: Record<number, number> };

// 'over' keeps the result on screen after all fingers are lifted, until the next touch.
type Phase = 'collect' | 'result' | 'over';

function freeColor(fingers: Finger[]) {
  const used = new Set(fingers.map((f) => f.color));
  let index = 0;
  while (used.has(index)) index += 1;
  return index;
}

export function FingerPicker({
  t,
  locale,
  split,
  onQuit,
}: {
  t: Dictionary;
  locale: Locale;
  split: PickerSplit;
  onQuit: () => void;
}) {
  useWakeLock();
  const areaRef = useRef<HTMLDivElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const active = useRef(new Set<number>());
  const phaseRef = useRef<Phase>('collect');
  const fingersRef = useRef<Finger[]>([]);
  const [fingers, setFingers] = useState<Finger[]>([]);
  const [phase, setPhase] = useState<Phase>('collect');
  const [result, setResult] = useState<Result | null>(null);
  const [changeKey, setChangeKey] = useState(0);

  const teams = teamCount(split);
  const minFingers = Math.max(2, teams);
  const ready = phase === 'collect' && fingers.length >= minFingers;

  const goTo = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    fingersRef.current = fingers;
  }, [fingers]);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      const current = fingersRef.current;
      if (current.length < minFingers) return;
      if (teams === 1) {
        const winner = current[Math.floor(Math.random() * current.length)]!;
        setResult({ kind: 'winner', id: winner.id, x: winner.x, y: winner.y });
      } else {
        const teamOf: Record<number, number> = {};
        shuffle(current).forEach((finger, index) => {
          teamOf[finger.id] = index % teams;
        });
        setResult({ kind: 'teams', teamOf });
      }
      phaseRef.current = active.current.size === 0 ? 'over' : 'result';
      setPhase(phaseRef.current);
      vibrate(PICK_VIBRATION_MS);
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [ready, changeKey, minFingers, teams]);

  useEffect(() => {
    if (result?.kind !== 'winner' || prefersReducedMotion()) return;
    const at = `at ${result.x}px ${result.y}px`;
    floodRef.current?.animate(
      [{ clipPath: `circle(${CIRCLE_PX / 2}px ${at})` }, { clipPath: `circle(150vmax ${at})` }],
      { duration: 500, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' },
    );
  }, [result]);

  // React attaches touch listeners as passive, so iOS scrolling, zooming and the magnifier can
  // only be blocked with native non-passive listeners.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const block = (e: Event) => e.preventDefault();
    const types = ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'contextmenu'];
    types.forEach((type) => el.addEventListener(type, block, { passive: false }));
    return () => types.forEach((type) => el.removeEventListener(type, block));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    active.current.add(e.pointerId);
    const finger = { id: e.pointerId, x: e.clientX, y: e.clientY };

    if (phaseRef.current === 'result') return;
    if (phaseRef.current === 'over') {
      goTo('collect');
      setResult(null);
      setFingers([{ ...finger, color: 0 }]);
    } else {
      setFingers((prev) =>
        prev.some((f) => f.id === finger.id)
          ? prev
          : [...prev, { ...finger, color: freeColor(prev) }],
      );
    }
    setChangeKey((key) => key + 1);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active.current.has(e.pointerId)) return;
    const { pointerId, clientX, clientY } = e;
    setFingers((prev) => {
      const index = prev.findIndex((f) => f.id === pointerId);
      if (index < 0) return prev;
      const next = [...prev];
      next[index] = { ...prev[index]!, x: clientX, y: clientY };
      return next;
    });
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active.current.delete(e.pointerId)) return;
    if (phaseRef.current === 'collect') {
      const { pointerId } = e;
      setFingers((prev) => prev.filter((f) => f.id !== pointerId));
      setChangeKey((key) => key + 1);
    } else if (phaseRef.current === 'result' && active.current.size === 0) {
      goTo('over');
    }
  };

  const winner =
    result?.kind === 'winner' ? fingers.find((finger) => finger.id === result.id) : undefined;
  const winnerColor = winner ? fingerColor(winner.color) : null;
  const shown = winner ? [winner] : fingers;

  const announcement =
    result?.kind === 'winner'
      ? t.winnerChosen
      : result?.kind === 'teams'
        ? t.teamsChosen(teams)
        : fingers.length > 0
          ? t.fingerCount(fingers.length)
          : '';

  return (
    <GameShell
      color={winnerColor ? { bg: PICKER_SCREEN.bg, fg: winnerColor.fg } : PICKER_SCREEN}
      themeColor={winnerColor?.bg ?? PICKER_SCREEN.bg}
      lang={locale}
      labels={t}
      onQuit={onQuit}
    >
      <style>{`@keyframes stb-countdown { from { stroke-dashoffset: 0; } to { stroke-dashoffset: ${RING_LENGTH}; } }`}</style>

      {winnerColor && (
        <div
          ref={floodRef}
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: winnerColor.bg }}
        />
      )}

      <div
        ref={areaRef}
        role="application"
        aria-label={t.pickerLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className="absolute inset-0 touch-none"
      >
        {phase === 'collect' && fingers.length === 0 && (
          <div className="pointer-events-none flex h-full items-center justify-center pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))]">
            <p className="max-w-md text-center text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
              {t.fingerPrompt}
            </p>
          </div>
        )}

        {shown.map((finger) => {
          const team = result?.kind === 'teams' ? result.teamOf[finger.id] : undefined;
          const color =
            team !== undefined ? TEAM_COLORS[team]! : (winnerColor ?? fingerColor(finger.color));
          const labelAbove = finger.y > LABEL_OFFSET_PX + 48;

          return (
            <div
              key={finger.id}
              aria-hidden
              className="pointer-events-none absolute top-0 left-0"
              style={{ transform: `translate(${finger.x}px, ${finger.y}px)` }}
            >
              {ready && (
                <svg
                  key={changeKey}
                  width={RING_PX}
                  height={RING_PX}
                  viewBox={`0 0 ${RING_PX} ${RING_PX}`}
                  className="absolute -rotate-90"
                  style={{ left: -RING_PX / 2, top: -RING_PX / 2 }}
                >
                  <circle
                    cx={RING_PX / 2}
                    cy={RING_PX / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke={color.bg}
                    strokeWidth={4}
                    strokeDasharray={RING_LENGTH}
                    style={{ animation: `stb-countdown ${HOLD_MS}ms linear forwards` }}
                  />
                </svg>
              )}

              <div
                className={cn(
                  'absolute rounded-full transition-[transform,background-color] duration-300 ease-out motion-reduce:transition-none',
                  winner && 'border-8',
                )}
                style={{
                  width: CIRCLE_PX,
                  height: CIRCLE_PX,
                  left: -CIRCLE_PX / 2,
                  top: -CIRCLE_PX / 2,
                  backgroundColor: color.bg,
                  borderColor: color.fg,
                  transform: winner ? 'scale(1.8)' : 'scale(1)',
                }}
              />

              {team !== undefined && (
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-7xl leading-none font-bold tabular-nums"
                  style={{
                    left: 0,
                    top: labelAbove ? -LABEL_OFFSET_PX : LABEL_OFFSET_PX,
                    color: color.bg,
                  }}
                >
                  {team + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </GameShell>
  );
}
