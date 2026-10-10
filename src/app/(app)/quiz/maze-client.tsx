'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getTodaysMaze, getMazeDay } from '@/lib/maze';
import type { MazeData, Position } from '@/lib/maze';

type GameState = 'playing' | 'won';

const GAP_PX = 2;

export function MazeClient() {
  const [maze] = useState<MazeData>(() => getTodaysMaze());
  const [playerPos, setPlayerPos] = useState<Position>(() => ({ ...maze.start }));
  const [deaths, setDeaths] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [steps, setSteps] = useState(0);
  const [shakeCount, setShakeCount] = useState(0); // For error animation
  const [discoveredWalls, setDiscoveredWalls] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const reduceMotion = useReducedMotion();

  const move = useCallback(
    (dx: number, dy: number) => {
      if (gameState !== 'playing') return;

      const nx = playerPos.x + dx;
      const ny = playerPos.y + dy;

      // Out of bounds
      if (nx < 0 || nx >= maze.width || ny < 0 || ny >= maze.height) {
        // Check if stepping onto the exit
        if (nx === maze.end.x && ny === maze.end.y) {
          setGameState('won');
          setPlayerPos({ x: nx, y: ny });
        }
        return;
      }

      // Wall collision → death
      if (!maze.grid[ny]![nx]) {
        setDeaths((d) => d + 1);
        setShakeCount((c) => c + 1);
        setDiscoveredWalls((prev) => {
          const nextSet = new Set(prev);
          nextSet.add(`${nx},${ny}`);
          return nextSet;
        });
        setPlayerPos({ ...maze.start });
        return;
      }

      // Check if reached the exit
      if (nx === maze.end.x && ny === maze.end.y) {
        setGameState('won');
        setSteps((s) => s + 1);
        setPlayerPos({ x: nx, y: ny });
        return;
      }

      setSteps((s) => s + 1);
      setPlayerPos({ x: nx, y: ny });
    },
    [gameState, maze, playerPos],
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          move(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          move(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          move(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          move(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // The root layout renders a footer below the page, so lock page scroll while the maze is open.
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevOverscroll = html.style.overscrollBehavior;
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    return () => {
      html.style.overflow = prevOverflow;
      html.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  // Touch/swipe controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]!;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0]!;
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const minSwipe = 30;

      if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 1 : -1, 0);
      } else {
        move(0, dy > 0 ? 1 : -1);
      }
      touchStartRef.current = null;
    },
    [move],
  );

  const day = getMazeDay();

  // Percent offsets in translate refer to the player's own size, which equals one cell.
  const cellSize = `calc((100% - ${(maze.width - 1) * GAP_PX}px) / ${maze.width})`;

  return (
    <div
      className="flex h-dvh w-full touch-none flex-col overflow-hidden bg-black pt-[env(safe-area-inset-top)] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] text-white select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex shrink-0 items-center pt-2">
        <Link
          href="/"
          className="-ml-2 flex min-h-12 items-center gap-2 rounded-xl px-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-white"
        >
          <X size={20} aria-hidden />
          Beenden
        </Link>
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Blind Maze #{day}
          </h1>
          <p className="text-base text-white/60 tabular-nums" aria-live="polite">
            {deaths} deaths, {steps} steps
          </p>
        </header>

        <motion.div
          className="relative"
          style={{ width: 'min(100%, 36rem, max(16rem, 100dvh - 18rem))' }}
          animate={shakeCount > 0 && !reduceMotion ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          key={shakeCount} // Force re-render of animation on collision
        >
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${maze.width}, 1fr)`, gap: `${GAP_PX}px` }}
          >
            {maze.grid.map((row, y) =>
              row.map((_, x) => {
                const isExit = maze.end.x === x && maze.end.y === y;
                const isDiscoveredWall = !maze.grid[y]![x] && discoveredWalls.has(`${x},${y}`);

                return (
                  <div
                    key={`${x}-${y}`}
                    className="relative flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-white/10"
                  >
                    {isExit && (
                      <Image
                        src="/quiz/goal.png"
                        alt="Goal"
                        width={64}
                        height={64}
                        className="h-full w-full object-contain p-1"
                      />
                    )}

                    {isDiscoveredWall && (
                      <div className="absolute inset-0 bg-black">
                        <Image
                          src="/quiz/wall.png"
                          alt="Wall"
                          width={64}
                          height={64}
                          className="h-full w-full object-cover p-0.5"
                        />
                      </div>
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <motion.div
            className="absolute top-0 left-0 flex aspect-square items-center justify-center"
            style={{ width: cellSize }}
            initial={false}
            animate={{
              x: `calc(${playerPos.x} * 100% + ${playerPos.x * GAP_PX}px)`,
              y: `calc(${playerPos.y} * 100% + ${playerPos.y * GAP_PX}px)`,
            }}
            transition={
              reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }
            }
          >
            <Image
              src="/quiz/player.png"
              alt="Player"
              width={64}
              height={64}
              className="h-[120%] w-[120%] max-w-none shrink-0 object-contain"
            />
          </motion.div>
        </motion.div>

        <p className="text-sm text-white/60">Arrow keys or swipe</p>
      </main>

      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="maze-won-title"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black pt-[max(3rem,env(safe-area-inset-top))] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(3rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] text-white"
          >
            <div className="flex w-full max-w-md flex-col gap-12">
              <div className="flex flex-col gap-2">
                <p className="text-base text-white/60">Blind Maze #{day}</p>
                <h2
                  id="maze-won-title"
                  className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                >
                  Gewonnen!
                </h2>
              </div>

              <dl className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-1">
                  <dt className="text-base text-white/60">Deaths</dt>
                  <dd className="text-4xl font-bold tabular-nums">{deaths}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-base text-white/60">Steps</dt>
                  <dd className="text-4xl font-bold tabular-nums">{steps}</dd>
                </div>
              </dl>

              <button
                type="button"
                autoFocus
                className="flex min-h-14 w-full items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-black transition-colors duration-150 outline-none hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                onClick={() => {
                  const text = `Blind Maze #${day}\n${deaths} Deaths\n${steps} Steps\nKannst du mich schlagen?`;
                  navigator.clipboard.writeText(text).then(
                    () => setCopied(true),
                    () => setCopied(false),
                  );
                }}
              >
                {copied ? 'Kopiert' : 'Ergebnis kopieren'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
