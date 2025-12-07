'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Lightbulb, RefreshCw } from 'lucide-react';

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

function generateModule(): string {
    let len = 0;
    let sheet = 'M: 4/4\n' + 'L:1/1\n' + 'Q:75\n' + '|:';
    sheet += 'c/4 c/4 c/4 c/4 |';
    while (len < 1.75) {
        const ran = Math.round(Math.random() * 10);
        const cPattern = getPattern(ran);
        len += cPattern.length;
        sheet += cPattern.pattern + ' ';
        if (len % 1 === 0) {
            sheet += '|';
        }
    }
    sheet += 'c/4||';
    return sheet;
}

function getPattern(i: number): { pattern: string; length: number } {
    switch (i) {
        case 0:
            return { pattern: 'c/16c/16c/16c/16', length: 0.25 };
        case 1:
            return { pattern: 'c/4', length: 0.25 };
        case 2:
            return { pattern: 'c/4', length: 0.25 };
        case 3:
            return { pattern: 'c/8c/8', length: 0.25 };
        case 4:
            return { pattern: 'c/8c/16c/16', length: 0.25 };
        case 5:
            return { pattern: 'c/6c/16', length: 0.25 };
        case 6:
            return { pattern: '(3c/8c/8c/8', length: 0.25 };
        case 7:
            return { pattern: 'z/8 c/8', length: 0.25 };
        case 8:
            return { pattern: 'z/4', length: 0.25 };
        case 9:
            return { pattern: 'c/4', length: 0.25 };
        case 10:
            return { pattern: 'c/4', length: 0.25 };
        default:
            return { pattern: 'c/4', length: 0.25 };
    }
}

export default function BCOTrainerPage() {
    const [isPaperVisible, setIsPaperVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [abcjs, setAbcjs] = useState<ABCJSModule | null>(null);
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

        const sheet = generateModule();
        const result = abcjs.renderAbc(paperRef.current, sheet, {
            responsive: 'resize',
        });
        visualObjRef.current = result[0] ?? null;
    }, [abcjs]);

    // Initialize music on abcjs load
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
        <main className="flex flex-col items-center justify-around min-h-[calc(100dvh-2rem)] bg-gradient-to-br from-slate-800 via-slate-700 to-gray-900 px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-200 drop-shadow-lg text-center">
                BCO - Trainer
            </h1>

            <div
                ref={paperRef}
                className={`w-full max-w-2xl transition-colors duration-300 rounded-lg p-4 ${isPaperVisible ? 'bg-slate-100 text-slate-800' : 'bg-slate-600 text-slate-600'
                    }`}
                style={{
                    minHeight: '120px',
                }}
            />

            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {!isPlaying ? (
                    <Button
                        onClick={handlePlay}
                        className="w-20 h-20 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                        size="icon"
                        aria-label="Play"
                    >
                        <Play className="w-10 h-10 text-white" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleStop}
                        className="w-20 h-20 rounded-xl bg-red-500 hover:bg-red-600 shadow-lg"
                        size="icon"
                        aria-label="Stop"
                    >
                        <Square className="w-10 h-10 text-white" />
                    </Button>
                )}

                <Button
                    onClick={handleToggleVisibility}
                    className="w-20 h-20 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg"
                    size="icon"
                    aria-label="Show/Hide Sheet"
                >
                    <Lightbulb className="w-10 h-10 text-white" />
                </Button>

                <Button
                    onClick={handleReload}
                    className="w-20 h-20 rounded-xl bg-amber-500 hover:bg-amber-600 shadow-lg"
                    size="icon"
                    aria-label="Reload"
                >
                    <RefreshCw className="w-10 h-10 text-white" />
                </Button>
            </div>

            {audioError && (
                <div className="text-red-400 text-center">Audio is not supported in this browser.</div>
            )}

            <p className="text-xs text-slate-400 absolute right-2 bottom-10">By Lars & Leo</p>
        </main>
    );
}
