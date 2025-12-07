import { Gauge, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Difficulty } from './types';
import { DIFFICULTY_CONFIG } from './utils';

type SettingsPanelProps = {
    difficulty: Difficulty;
    setDifficulty: (d: Difficulty) => void;
    tempo: number;
    setTempo: (fn: (t: number) => number) => void;
    measures: number;
    setMeasures: (fn: (m: number) => number) => void;
    isPlaying: boolean;
}

export function SettingsPanel({
    difficulty,
    setDifficulty,
    tempo,
    setTempo,
    measures,
    setMeasures,
    isPlaying,
}: SettingsPanelProps) {
    return (
        <Card className="w-full bg-white border-slate-200 shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
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
                        <span className="w-16 text-center text-xl font-bold text-slate-700">
                            {tempo}
                        </span>
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
                        <span className="w-12 text-center text-xl font-bold text-slate-700">
                            {measures}
                        </span>
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
    );
}
