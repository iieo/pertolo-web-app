'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Play,
    Square,
    Eye,
    EyeOff,
    RotateCcw,
    Music,
    Volume2,
    Minus,
    Plus,
    Gauge,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

// Type declarations for abcjs
interface VisualObj {
    millisecondsPerMeasure: () => number;
}

interface CreateSynth {
    init: (options: {
        visualObj: VisualObj;
        audioContext: AudioContext;
        millisecondsPerMeasure: number;
    }) => Promise<unknown>;
    prime: () => Promise<void>;
    start: () => void;
    stop: () => void;
}

interface ABCJSModule {
    renderAbc: (
        element: string | HTMLElement,
        abc: string,
        options?: { responsive?: string }
    ) => VisualObj[];
    synth: {
        supportsAudio: () => boolean;
        CreateSynth: new () => CreateSynth;
    };
}

// Difficulty levels
type Difficulty = 'easy' | 'medium' | 'hard';

// Pattern definition with weight for probability
interface RhythmPattern {
    pattern: string;
    length: number; // in quarter notes (0.25 = sixteenth, 0.5 = eighth, 1 = quarter)
    difficulty: Difficulty[];
    category: 'basic' | 'syncopated' | 'triplet' | 'rest' | 'mixed';
}

// Comprehensive rhythm patterns
const RHYTHM_PATTERNS: RhythmPattern[] = [
    // Basic patterns (Easy)
    { pattern: 'c', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
    { pattern: 'c/2 c/2', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
    { pattern: 'c/4 c/4 c/4 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
    { pattern: 'c/2 c/4 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
    { pattern: 'c/4 c/4 c/2', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
    { pattern: 'c/4 c/2 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },

    // Eighth note patterns (Easy-Medium)
    { pattern: 'c/2 c/8 c/8 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
    { pattern: 'c/4 c/8 c/8 c/2', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
    { pattern: 'c/8 c/8 c/8 c/8 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'basic' },
    { pattern: 'c/8 c/8 c/4 c/8 c/8 c/4', length: 1, difficulty: ['medium', 'hard'], category: 'basic' },

    // Sixteenth note patterns (Medium-Hard)
    { pattern: 'c/16 c/16 c/16 c/16 c/4 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'basic' },
    { pattern: 'c/4 c/16 c/16 c/16 c/16 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'basic' },
    { pattern: 'c/2 c/16 c/16 c/16 c/16 c/4', length: 1, difficulty: ['medium', 'hard'], category: 'basic' },
    { pattern: 'c/16 c/16 c/8 c/16 c/16 c/8 c/2', length: 1, difficulty: ['hard'], category: 'basic' },
    { pattern: 'c/8 c/16 c/16 c/8 c/16 c/16 c/4', length: 1, difficulty: ['hard'], category: 'mixed' },

    // Syncopated patterns (Medium-Hard)
    { pattern: 'c/4 c/2 c/4', length: 1, difficulty: ['medium', 'hard'], category: 'syncopated' },
    { pattern: 'c/8 c/4 c/8 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'syncopated' },
    { pattern: 'c/8 c/2 c/8 c/4', length: 1, difficulty: ['hard'], category: 'syncopated' },
    { pattern: 'c/4 c/8 c/4 c/8 c/4', length: 1, difficulty: ['hard'], category: 'syncopated' },
    { pattern: 'c/8 c/8 c/4 c/4 c/8 c/8', length: 1, difficulty: ['hard'], category: 'syncopated' },

    // Triplet patterns (Medium-Hard)
    { pattern: '(3c/4c/4c/4 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'triplet' },
    { pattern: 'c/2 (3c/4c/4c/4', length: 1, difficulty: ['medium', 'hard'], category: 'triplet' },
    { pattern: 'c/4 (3c/4c/4c/4 c/4', length: 1, difficulty: ['medium', 'hard'], category: 'triplet' },
    { pattern: '(3c/4c/4c/4 (3c/4c/4c/4', length: 1, difficulty: ['hard'], category: 'triplet' },
    { pattern: '(3c/8c/8c/8 (3c/8c/8c/8 c/2', length: 1, difficulty: ['hard'], category: 'triplet' },

    // Rest patterns (All difficulties)
    { pattern: 'z/4 c/4 c/2', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'rest' },
    { pattern: 'c/2 z/4 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'rest' },
    { pattern: 'c/4 z/4 c/4 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'rest' },
    { pattern: 'z/8 c/8 c/4 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'rest' },
    { pattern: 'c/4 z/8 c/8 z/8 c/8 c/4', length: 1, difficulty: ['hard'], category: 'rest' },
    { pattern: 'z/4 c/8 c/8 c/4 z/4', length: 1, difficulty: ['medium', 'hard'], category: 'rest' },

    // Complex mixed patterns (Hard only)
    { pattern: 'c/16 c/16 c/8 c/4 c/8 c/16 c/16 c/4', length: 1, difficulty: ['hard'], category: 'mixed' },
    { pattern: '(3c/8c/8c/8 c/8 c/16 c/16 c/4', length: 1, difficulty: ['hard'], category: 'mixed' },
    { pattern: 'c/8 z/16 c/16 c/4 c/8 c/8 c/4', length: 1, difficulty: ['hard'], category: 'mixed' },
];

function generateRhythm(difficulty: Difficulty, measures: number, tempo: number): string {
    // Filter patterns by difficulty
    const availablePatterns = RHYTHM_PATTERNS.filter((p) => p.difficulty.includes(difficulty));

    // Build the ABC notation
    let sheet = `M: 4/4\nL:1/1\nQ:${tempo}\n|:`;

    // Add count-in measure (4 quarter notes)
    sheet += 'c/4 c/4 c/4 c/4 |';

    // Generate random measures
    for (let m = 0; m < measures; m++) {
        const randomIndex = Math.floor(Math.random() * availablePatterns.length);
        const pattern = availablePatterns[randomIndex];
        if (pattern) {
            sheet += pattern.pattern;
        }

        if (m < measures - 1) {
            sheet += ' |';
        }
    }

    // End with a final note
    sheet += ' |c/4||';

    return sheet;
}

// Difficulty labels and colors
const DIFFICULTY_CONFIG = {
    easy: { label: 'Easy', color: 'bg-green-500', textColor: 'text-green-400' },
    medium: { label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-400' },
    hard: { label: 'Hard', color: 'bg-red-500', textColor: 'text-red-400' },
};

export default function BCOTrainerPage() {
    const [isPaperVisible, setIsPaperVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [abcjs, setAbcjs] = useState<ABCJSModule | null>(null);

    // New settings state
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [tempo, setTempo] = useState(75);
    const [measures, setMeasures] = useState(2);

    const paperRef = useRef<HTMLDivElement>(null);
    const visualObjRef = useRef<VisualObj | null>(null);
    const midiBufferRef = useRef<CreateSynth | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Load abcjs dynamically (client-side only)
    useEffect(() => {
        import('abcjs').then((module) => {
            setAbcjs(module.default as unknown as ABCJSModule);
        });
    }, []);

    const initMusic = useCallback(() => {
        if (!abcjs || !paperRef.current) return;

        const sheet = generateRhythm(difficulty, measures, tempo);
        const result = abcjs.renderAbc(paperRef.current, sheet, {
            responsive: 'resize',
        });
        visualObjRef.current = result[0] ?? null;
    }, [abcjs, difficulty, measures, tempo]);

    // Initialize music on abcjs load or settings change
    useEffect(() => {
        if (abcjs) {
            initMusic();
        }
    }, [abcjs, initMusic]);

    const handlePlay = async () => {
        if (!abcjs || !visualObjRef.current) return;

        if (!abcjs.synth.supportsAudio()) {
            setAudioError(true);
            return;
        }

        try {
            // Create or resume audio context
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext ||
                    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            }

            await audioContextRef.current.resume();

            midiBufferRef.current = new abcjs.synth.CreateSynth();
            await midiBufferRef.current.init({
                visualObj: visualObjRef.current,
                audioContext: audioContextRef.current,
                millisecondsPerMeasure: visualObjRef.current.millisecondsPerMeasure(),
            });
            await midiBufferRef.current.prime();
            midiBufferRef.current.start();
            setIsPlaying(true);
        } catch (error) {
            console.warn('synth error', error);
            if ((error as { status?: string })?.status === 'NotSupported') {
                setAudioError(true);
            }
        }
    };

    const handleStop = () => {
        if (midiBufferRef.current) {
            midiBufferRef.current.stop();
        }
        setIsPlaying(false);
    };

    const handleToggleVisibility = () => {
        setIsPaperVisible(!isPaperVisible);
    };

    const handleReload = () => {
        handleStop();
        setIsPaperVisible(false);
        initMusic();
    };

    return (
        <main className="flex flex-col items-center min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8 gap-4 md:gap-6">
            {/* Header */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 md:p-3 bg-purple-100 rounded-2xl">
                    <Music className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                    BCO Trainer
                </h1>
            </div>

            {/* Sheet Music Card - Auto height based on content */}
            <Card className="w-full max-w-5xl bg-white border-slate-200 shadow-lg overflow-hidden">
                <div className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200 shrink-0">
                    <div className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span className="text-sm text-slate-600 font-medium">
                                {isPlaying ? 'Playing...' : 'Ready'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="hidden sm:inline">{measures} {measures === 1 ? 'measure' : 'measures'}</span>
                            <span>♩ = {tempo}</span>
                            <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-green-500' : 'text-slate-400'}`} />
                        </div>
                    </div>
                </div>
                <div
                    ref={paperRef}
                    className={`w-full transition-all duration-500 ease-out p-4 md:p-6 ${isPaperVisible
                        ? 'bg-white [&_svg]:fill-slate-800 [&_svg_path]:stroke-slate-800'
                        : 'bg-slate-200 [&_svg]:opacity-0 [&_svg_path]:opacity-0'
                        }`}
                />
            </Card>

            {/* Controls Container */}
            <div className="w-full max-w-5xl flex flex-col gap-4 md:gap-6 shrink-0">
                {/* Settings Panel */}
                <Card className="w-full bg-white border-slate-200 shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
                        {/* Difficulty Selector */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Gauge className="w-4 h-4 text-slate-500" />
                                <span className="text-xs text-slate-500 font-medium">Difficulty</span>
                            </div>
                            <div className="flex gap-1 w-full justify-center">
                                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                    <Button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        disabled={isPlaying}
                                        className={`flex-1 md:flex-none px-3 py-1 text-xs rounded-lg transition-all border-0 ${difficulty === d
                                            ? `${DIFFICULTY_CONFIG[d].color} text-white shadow-md`
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        size="sm"
                                    >
                                        {DIFFICULTY_CONFIG[d].label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Tempo Control */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Tempo (BPM)</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setTempo((t) => Math.max(40, t - 5))}
                                    disabled={isPlaying || tempo <= 40}
                                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-0"
                                    size="icon"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-16 text-center text-xl font-bold text-slate-700">{tempo}</span>
                                <Button
                                    onClick={() => setTempo((t) => Math.min(200, t + 5))}
                                    disabled={isPlaying || tempo >= 200}
                                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-0"
                                    size="icon"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Measures Control */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Measures</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setMeasures((m) => Math.max(1, m - 1))}
                                    disabled={isPlaying || measures <= 1}
                                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-0"
                                    size="icon"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-12 text-center text-xl font-bold text-slate-700">{measures}</span>
                                <Button
                                    onClick={() => setMeasures((m) => Math.min(8, m + 1))}
                                    disabled={isPlaying || measures >= 8}
                                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-0"
                                    size="icon"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 md:gap-8">
                    {/* Play/Stop Button */}
                    <div className="flex flex-col items-center gap-2">
                        {!isPlaying ? (
                            <Button
                                onClick={handlePlay}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 border-0"
                                size="icon"
                                aria-label="Play"
                            >
                                <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleStop}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 border-0"
                                size="icon"
                                aria-label="Stop"
                            >
                                <Square className="w-7 h-7 md:w-9 md:h-9 text-white fill-white" />
                            </Button>
                        )}
                        <span className="text-xs text-slate-500 font-medium">
                            {isPlaying ? 'Stop' : 'Play'}
                        </span>
                    </div>

                    {/* Reveal Button */}
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            onClick={handleToggleVisibility}
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl transition-all duration-200 hover:scale-105 border-0 ${isPaperVisible
                                ? 'bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40'
                                : 'bg-gradient-to-br from-slate-400 to-slate-500 hover:from-slate-300 hover:to-slate-400 shadow-lg shadow-slate-400/30 hover:shadow-xl hover:shadow-slate-400/40'
                                }`}
                            size="icon"
                            aria-label="Show/Hide Sheet"
                        >
                            {isPaperVisible ? (
                                <EyeOff className="w-7 h-7 md:w-9 md:h-9 text-white" />
                            ) : (
                                <Eye className="w-7 h-7 md:w-9 md:h-9 text-white" />
                            )}
                        </Button>
                        <span className="text-xs text-slate-500 font-medium">
                            {isPaperVisible ? 'Hide' : 'Reveal'}
                        </span>
                    </div>

                    {/* Reload Button */}
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            onClick={handleReload}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40 border-0"
                            size="icon"
                            aria-label="New Pattern"
                        >
                            <RotateCcw className="w-7 h-7 md:w-9 md:h-9 text-white" />
                        </Button>
                        <span className="text-xs text-slate-500 font-medium">New</span>
                    </div>
                </div>
            </div>

            {/* Audio Error */}
            {audioError && (
                <div className="mt-4 px-4 py-2 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">
                        Audio is not supported in this browser.
                    </p>
                </div>
            )}

            {/* Credits */}
            <p className="mt-auto pt-4 text-xs text-slate-400">By Lars & Leo</p>
        </main>
    );
}