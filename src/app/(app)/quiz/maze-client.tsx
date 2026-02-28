'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getTodaysMaze, getMazeDay } from '@/lib/maze';
import type { MazeData, Position } from '@/lib/maze';

type GameState = 'playing' | 'won';

export function MazeClient() {
  const [maze] = useState<MazeData>(() => getTodaysMaze());
  const [playerPos, setPlayerPos] = useState<Position>(() => ({ ...maze.start }));
  const [deaths, setDeaths] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [steps, setSteps] = useState(0);
  const [shakeCount, setShakeCount] = useState(0); // For error animation
  const [discoveredWalls, setDiscoveredWalls] = useState<Set<string>>(new Set());
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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

  return (
    <div
      className="min-h-dvh w-full bg-[#1a1423] flex flex-col items-center justify-center text-white p-4 overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Minimal Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-purple-900/20 via-[#1a1423] to-[#1a1423] pointer-events-none" />

      {/* Header */}
      <div className="mb-8 z-10 text-center flex flex-col items-center gap-2">
        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
          BLIND MAZE #{day}
        </h1>
        <div className="flex gap-4 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-xl backdrop-blur-sm">
          <span className="flex items-center gap-1 text-red-400">
            <span className="text-lg">💀</span> {deaths} deaths
          </span>
          <span className="text-white/30">•</span>
          <span className="text-blue-300">{steps} steps</span>
        </div>
      </div>

      {/* Game Board container */}
      <motion.div
        className="relative z-10 p-2 sm:p-4 rounded-2xl bg-black/40 border border-white/10 shadow-2xl backdrop-blur-md"
        animate={shakeCount > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        key={shakeCount} // Force re-render of animation on collision
      >
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${maze.width}, 1fr)` }}
        >
          {maze.grid.map((row, y) =>
            row.map((_, x) => {
              const isExit = maze.end.x === x && maze.end.y === y;
              const isDiscoveredWall = !maze.grid[y]![x] && discoveredWalls.has(`${x},${y}`);
              // Cell background - deep navy/purple
              const bg = 'bg-[#2a2438]';

              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-7 h-7 sm:w-10 sm:h-10 ${bg} rounded-sm flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Exit Marker */}
                  {isExit && (
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                      <Image
                        src="/quiz/goal.png"
                        alt="Goal"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  )}

                  {/* Discovered Wall */}
                  {isDiscoveredWall && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <Image
                        src="/quiz/wall.png"
                        alt="Wall"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover p-0.5"
                      />
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>

        {/* Player overlay (moves freely over the grid) */}
        <motion.div
          className="absolute w-7 h-7 sm:w-10 sm:h-10 top-0 left-0 flex items-center justify-center"
          // Account for the padding of the container (p-2 sm:p-4) AND gap (2px)
          animate={{
            x: `calc(${playerPos.x} * 100% + ${playerPos.x * 2}px + var(--p-offset))`,
            y: `calc(${playerPos.y} * 100% + ${playerPos.y * 2}px + var(--p-offset))`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={
            {
              // Dynamic JS variable mapped to container padding
              // using standard CSS vars injected conditionally
            }
          }
        >
          <Image
            src="/quiz/player.png"
            alt="Player"
            width={40}
            height={40}
            className="w-[120%] h-[120%] object-contain drop-shadow-md z-20"
          />
        </motion.div>

        {/* Embedded CSS for padding offset calculation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @media (min-width: 640px) { :root { --p-offset: 16px; } }
                    @media (max-width: 639px) { :root { --p-offset: 8px; } }
                `,
          }}
        />
      </motion.div>

      {/* Controls pointer */}
      <div className="mt-8 z-10 flex gap-2 items-center text-white/40 text-sm font-medium">
        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Arrow Keys</kbd>
        <span>or Swipe</span>
      </div>

      {/* Win modal */}
      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a1423] border border-purple-500/30 shadow-2xl shadow-purple-900/50 rounded-2xl p-8 text-center max-w-sm w-full relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />

              <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-linear-to-br from-white to-purple-200">
                GEWONNEN!
              </h2>
              <p className="text-purple-300/80 font-medium mb-6 uppercase tracking-widest text-sm">
                Blind Maze #{day}
              </p>

              <div className="flex justify-center gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black">{deaths}</span>
                  <span className="text-xs text-red-400 font-bold uppercase track">Deaths</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black">{steps}</span>
                  <span className="text-xs text-blue-400 font-bold uppercase">Steps</span>
                </div>
              </div>

              <button
                className="w-full relative group px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                onClick={() => {
                  const text = `Blind Maze #${day}\n💀 ${deaths} Deaths\n👣 ${steps} Steps\nKannst du mich schlagen?`;
                  navigator.clipboard.writeText(text);
                }}
              >
                <span>📋</span>
                <span>Ergebnis kopieren</span>
                <div className="absolute inset-0 rounded-xl ring-2 ring-white/50 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
