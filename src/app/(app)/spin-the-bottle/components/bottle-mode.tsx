'use client';

import { useEffect, useRef, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';
import { useWakeLock } from '@/components/game/hooks';
import type { Locale } from '@/components/game/locale';

import { prefersReducedMotion, vibrate } from '../device';
import type { Dictionary } from '../i18n';
import { BOTTLE_SCREEN } from '../palette';

const TAP_LOCK_MS = 300;
const TAP_DISTANCE_PX = 12;
const STOP_VIBRATION_MS = 60;
// Starts fast and slows down for a long time, like a real bottle losing momentum.
const SPIN_EASING = 'cubic-bezier(0.15, 0.75, 0.2, 1)';

type Status = 'idle' | 'spinning' | 'stopped';

export function BottleMode({
  t,
  locale,
  onQuit,
}: {
  t: Dictionary;
  locale: Locale;
  onQuit: () => void;
}) {
  useWakeLock();
  const bottleRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const spinning = useRef(false);
  const lockedUntil = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const down = useRef<{ id: number; x: number; y: number; time: number } | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => () => clearTimeout(timer.current), []);

  const spin = (direction: 1 | -1, strength: number) => {
    const el = bottleRef.current;
    if (!el || spinning.current || performance.now() < lockedUntil.current) return;
    spinning.current = true;
    setStatus('spinning');

    const turns = 3 + strength * 4 + Math.random() * 2;
    const target = angle.current + direction * (turns * 360 + Math.random() * 360);
    angle.current = target;

    const finish = () => {
      spinning.current = false;
      lockedUntil.current = performance.now() + TAP_LOCK_MS;
      vibrate(STOP_VIBRATION_MS);
      setStatus('stopped');
    };

    if (prefersReducedMotion()) {
      el.style.transition = 'none';
      const fadeOut = el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 150,
        fill: 'forwards',
      });
      fadeOut.onfinish = () => {
        el.style.transform = `rotate(${target}deg)`;
        fadeOut.cancel();
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        timer.current = setTimeout(finish, 200);
      };
      return;
    }

    const duration = Math.min(5000, 3000 + strength * 1500 + Math.random() * 500);
    el.style.transition = `transform ${duration}ms ${SPIN_EASING}`;
    el.style.transform = `rotate(${target}deg)`;
    timer.current = setTimeout(finish, duration);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (down.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    down.current = { id: e.pointerId, x: e.clientX, y: e.clientY, time: performance.now() };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = down.current;
    if (!start || start.id !== e.pointerId) return;
    down.current = null;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const distance = Math.hypot(dx, dy);
    if (distance < TAP_DISTANCE_PX) {
      spin(1, 0.3 + Math.random() * 0.4);
      return;
    }

    // The sign of the cross product of (start - center) and the swipe tells the turn direction.
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = start.x - (rect.left + rect.width / 2);
    const ry = start.y - (rect.top + rect.height / 2);
    const direction = rx * dy - ry * dx >= 0 ? 1 : -1;
    const velocity = distance / Math.max(performance.now() - start.time, 1);
    spin(direction, Math.min(1, Math.max(0, (velocity - 0.2) / 2)));
  };

  return (
    <GameShell color={BOTTLE_SCREEN} lang={locale} labels={t} onQuit={onQuit}>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          ref={bottleRef}
          className="will-change-transform"
          style={{ height: 'min(80vw, 72dvh)', aspectRatio: '100 / 270' }}
        >
          <svg
            viewBox="0 10 100 270"
            className="block h-full w-full"
            aria-hidden
            style={{ fill: BOTTLE_SCREEN.fg }}
          >
            <path d="M36 10H64V22H60V95C60 115 82 125 82 150V268Q82 280 70 280H30Q18 280 18 268V150C18 125 40 115 40 95V22H36Z" />
          </svg>
        </div>
      </div>

      <button
        type="button"
        aria-label={t.spin}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          down.current = null;
        }}
        onClick={(e) => {
          if (e.detail === 0) spin(1, 0.3 + Math.random() * 0.4);
        }}
        className="absolute inset-0 z-10 block h-full w-full cursor-pointer touch-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
      />

      <p className="sr-only" aria-live="polite">
        {status === 'spinning' ? t.spinning : status === 'stopped' ? t.stopped : ''}
      </p>
    </GameShell>
  );
}
