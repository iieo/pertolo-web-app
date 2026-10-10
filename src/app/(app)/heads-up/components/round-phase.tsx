'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { GameShell } from '@/components/game/game-shell';
import type { GameColor } from '@/components/game/palette';
import { cn } from '@/lib/utils';

import { unlockOrientation, useIsLandscape, useTilt, useWakeLock, vibrate } from '../device';
import { useHeadsUpGame } from '../game-provider';
import { CORRECT_COLOR, PASS_COLOR, TIME_UP_COLOR, wordColor } from '../palette';

const COUNTDOWN_FROM = 3;
const FLASH_MS = 600;
const TIME_UP_MS = 1500;
const LAST_SECONDS = 5;
const LINE_HEIGHT = 1.1;
// Rough average glyph width of bold sans text in em. Only the starting guess; fitText measures.
const CHAR_WIDTH_EM = 0.62;

const BLACK: GameColor = { bg: '#000000', fg: '#FFFFFF' };

type Flash = 'correct' | 'pass';

export function RoundPhase() {
  const {
    phase,
    currentWord,
    wordNumber,
    roundLength,
    tiltEnabled,
    startPlaying,
    markWord,
    finishRound,
    backToSetup,
    locale,
    t,
  } = useHeadsUpGame();
  const landscape = useIsLandscape();
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const [remaining, setRemaining] = useState<number>(roundLength);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const locked = useRef(false);

  const answer = (correct: boolean) => {
    if (phase !== 'playing' || !landscape || timeUp || locked.current) return;
    locked.current = true;
    markWord(correct);
    setFlash(correct ? 'correct' : 'pass');
    vibrate(correct ? 60 : [40, 60, 40]);
  };

  // Screen to the floor means correct, screen to the ceiling means pass.
  const calibrate = useTilt(tiltEnabled, (direction) => answer(direction === 'down'));

  useWakeLock();

  useEffect(() => {
    if (phase !== 'countdown' || !landscape) return;
    const id = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
        return;
      }
      calibrate();
      startPlaying();
    }, 1000);
    return () => clearTimeout(id);
  }, [phase, landscape, count, calibrate, startPlaying]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const endsAt = performance.now() + roundLength * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - performance.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        setTimeUp(true);
        vibrate(400);
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase, roundLength]);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => {
      locked.current = false;
      setFlash(null);
    }, FLASH_MS);
    return () => clearTimeout(id);
  }, [flash]);

  useEffect(() => {
    if (!timeUp) return;
    const id = setTimeout(finishRound, TIME_UP_MS);
    return () => clearTimeout(id);
  }, [timeUp, finishRound]);

  let view: 'timeUp' | 'turn' | 'countdown' | 'flash' | 'word';
  if (timeUp) view = 'timeUp';
  else if (!landscape) view = 'turn';
  else if (phase === 'countdown') view = 'countdown';
  else if (flash) view = 'flash';
  else view = 'word';

  const color =
    view === 'timeUp'
      ? TIME_UP_COLOR
      : view === 'flash'
        ? flash === 'correct'
          ? CORRECT_COLOR
          : PASS_COLOR
        : view === 'word'
          ? wordColor(wordNumber)
          : BLACK;

  const finalSeconds = remaining <= LAST_SECONDS;

  return (
    <GameShell
      color={color}
      lang={locale}
      labels={t}
      onQuit={() => {
        unlockOrientation();
        backToSetup();
      }}
      showQuit={view !== 'timeUp'}
    >
      {view === 'timeUp' && <Message text={t.timeUp} />}

      {view === 'turn' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-3xl font-bold tracking-tight">{t.turnSideways}</p>
          <p className="max-w-sm text-base text-white/60">{t.rotationLockHint}</p>
        </div>
      )}

      {view === 'countdown' && (
        <div
          role="status"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center"
        >
          <span
            className="block leading-none font-bold tabular-nums"
            style={{ fontSize: 'clamp(4rem, 45dvh, 12rem)' }}
          >
            {count}
          </span>
          <span className="text-2xl font-semibold tracking-tight">{t.holdToForehead}</span>
        </div>
      )}

      {view === 'flash' && <Message text={flash === 'correct' ? t.correct : t.pass} />}

      {view === 'word' && currentWord !== null && (
        <>
          <FittedWord text={currentWord} />
          <div className="absolute inset-0 z-10 grid grid-cols-2">
            <button
              type="button"
              aria-label={t.markPass}
              onClick={() => answer(false)}
              className="h-full w-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
            />
            <button
              type="button"
              aria-label={t.markCorrect}
              onClick={() => answer(true)}
              className="h-full w-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
            />
          </div>
        </>
      )}

      {phase === 'playing' && !timeUp && landscape && (
        <div
          role="timer"
          aria-label={t.secondsLeft(remaining)}
          className={cn(
            'pointer-events-none absolute top-[calc(env(safe-area-inset-top)+0.5rem)] right-[max(1rem,env(safe-area-inset-right))] z-20 flex min-h-12 items-center tabular-nums',
            finalSeconds
              ? 'text-2xl font-bold animate-pulse motion-reduce:animate-none'
              : 'text-sm font-semibold opacity-80',
          )}
        >
          {remaining}
        </div>
      )}
    </GameShell>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div
      role="status"
      className="absolute inset-0 flex items-center justify-center px-8 text-center"
    >
      <span
        className="block leading-none font-bold tracking-tight"
        style={{ fontSize: 'clamp(3rem, min(16vw, 30dvh), 9rem)' }}
      >
        {text}
      </span>
    </div>
  );
}

// Smallest possible longest line when the text is split into at most two lines at a space.
function fitLength(text: string) {
  const tokens = text.split(/\s+/);
  let best = text.length;
  for (let i = 1; i < tokens.length; i++) {
    const first = tokens.slice(0, i).join(' ').length;
    const second = tokens.slice(i).join(' ').length;
    best = Math.min(best, Math.max(first, second));
  }
  return Math.max(best, 1);
}

function fitText(box: HTMLElement, el: HTMLElement, text: string) {
  const width = box.clientWidth;
  const height = box.clientHeight;
  if (width === 0 || height === 0) return;

  let size = Math.min(width / (CHAR_WIDTH_EM * fitLength(text)), (height / LINE_HEIGHT) * 0.75);
  const apply = () => {
    el.style.fontSize = `${size}px`;
  };
  apply();
  for (let i = 0; i < 40 && size > 12; i++) {
    const tooWide = el.scrollWidth > el.clientWidth;
    const tooTall = el.offsetHeight > height;
    const tooManyLines = el.offsetHeight > size * LINE_HEIGHT * 2 + 1;
    if (!tooWide && !tooTall && !tooManyLines) break;
    size *= 0.92;
    apply();
  }
}

function FittedWord({ text }: { text: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return;
    const fit = () => fitText(box, el, text);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div
      ref={boxRef}
      className="absolute top-16 right-[max(3rem,env(safe-area-inset-right))] bottom-16 left-[max(3rem,env(safe-area-inset-left))] flex items-center justify-center"
    >
      <span
        ref={textRef}
        className="block w-full text-center font-bold tracking-tight text-balance"
        style={{ lineHeight: LINE_HEIGHT }}
      >
        {text}
      </span>
    </div>
  );
}
