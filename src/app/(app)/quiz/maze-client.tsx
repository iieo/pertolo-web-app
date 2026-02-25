'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getTodaysMaze, getMazeDay } from '@/lib/maze';
import type { MazeData, Position } from '@/lib/maze';

type GameState = 'playing' | 'won';

export function MazeClient() {
    const [maze] = useState<MazeData>(() => getTodaysMaze());
    const [playerPos, setPlayerPos] = useState<Position>(() => ({ ...maze.start }));
    const [deaths, setDeaths] = useState(0);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [steps, setSteps] = useState(0);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const move = useCallback(
        (dx: number, dy: number) => {
            if (gameState !== 'playing') return;

            setPlayerPos((prev) => {
                const nx = prev.x + dx;
                const ny = prev.y + dy;

                // Out of bounds
                if (nx < 0 || nx >= maze.width || ny < 0 || ny >= maze.height) {
                    // Check if stepping onto the exit
                    if (nx === maze.end.x && ny === maze.end.y) {
                        setGameState('won');
                        return { x: nx, y: ny };
                    }
                    return prev;
                }

                // Wall collision → death
                if (!maze.grid[ny]![nx]) {
                    setDeaths((d) => d + 1);
                    return { ...maze.start };
                }

                // Check if reached the exit
                if (nx === maze.end.x && ny === maze.end.y) {
                    setGameState('won');
                    setSteps((s) => s + 1);
                    return { x: nx, y: ny };
                }

                setSteps((s) => s + 1);
                return { x: nx, y: ny };
            });
        },
        [gameState, maze],
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
            className="min-h-dvh w-full bg-gray-950 flex flex-col items-center justify-center text-white p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Header */}
            <div className="mb-4 text-center">
                <h1 className="text-2xl font-bold">Blind Maze #{day}</h1>
                <p className="text-gray-400 text-sm mt-1">
                    💀 {deaths} deaths · {steps} steps
                </p>
            </div>

            {/* Grid */}
            <div
                className="inline-grid gap-0 border border-gray-700"
                style={{
                    gridTemplateColumns: `repeat(${maze.width}, 1fr)`,
                }}
            >
                {maze.grid.map((row, y) =>
                    row.map((_, x) => {
                        const isPlayer = playerPos.x === x && playerPos.y === y;
                        const isExit = maze.end.x === x && maze.end.y === y;

                        let bg = 'bg-gray-800'; // all cells look the same (hidden)

                        if (isPlayer) {
                            bg = 'bg-yellow-400';
                        } else if (isExit) {
                            bg = 'bg-green-500';
                        }

                        return (
                            <div
                                key={`${x}-${y}`}
                                className={`w-6 h-6 sm:w-7 sm:h-7 ${bg} border border-gray-800/50 flex items-center justify-center text-xs`}
                            >
                                {isPlayer && '🏃'}
                                {isExit && !isPlayer && '🏁'}
                            </div>
                        );
                    }),
                )}
            </div>

            {/* Controls hint */}
            <p className="mt-4 text-gray-500 text-xs">
                Arrow keys / WASD / Swipe to move
            </p>

            {/* Win modal */}
            {gameState === 'won' && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center max-w-sm mx-4">
                        <h2 className="text-3xl font-bold mb-2">🎉 Geschafft!</h2>
                        <p className="text-gray-300 mb-4">
                            Blind Maze #{day}
                        </p>
                        <p className="text-lg">
                            💀 {deaths} Deaths · 👣 {steps} Steps
                        </p>
                        <button
                            className="mt-6 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors"
                            onClick={() => {
                                const text = `Blind Maze #${day}\n💀 ${deaths} Deaths · 👣 ${steps} Steps`;
                                navigator.clipboard.writeText(text);
                            }}
                        >
                            📋 Copy Result
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
