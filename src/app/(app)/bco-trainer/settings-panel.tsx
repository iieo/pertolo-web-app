import { Minus, Plus } from 'lucide-react';
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
};

const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

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
    <section
      aria-label="Settings"
      className="grid grid-cols-1 gap-8 border-t border-white/10 pt-8 md:grid-cols-3 md:gap-8"
    >
      <div role="group" aria-labelledby="bco-difficulty" className="flex flex-col gap-2">
        <span id="bco-difficulty" className="text-sm font-medium text-white/60">
          Difficulty
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              disabled={isPlaying}
              aria-pressed={difficulty === d}
              className={`min-h-12 rounded-xl px-2 text-base font-semibold transition-colors duration-150 motion-reduce:transition-none disabled:opacity-40 ${focusRing} ${
                difficulty === d
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              {DIFFICULTY_CONFIG[d].label}
            </button>
          ))}
        </div>
      </div>

      <Stepper
        label="Tempo (BPM)"
        value={tempo}
        onDecrease={() => setTempo((t) => Math.max(40, t - 5))}
        onIncrease={() => setTempo((t) => Math.min(200, t + 5))}
        decreaseDisabled={isPlaying || tempo <= 40}
        increaseDisabled={isPlaying || tempo >= 200}
      />

      <Stepper
        label="Measures"
        value={measures}
        onDecrease={() => setMeasures((m) => Math.max(1, m - 1))}
        onIncrease={() => setMeasures((m) => Math.min(8, m + 1))}
        decreaseDisabled={isPlaying || measures <= 1}
        increaseDisabled={isPlaying || measures >= 8}
      />
    </section>
  );
}

function Stepper({
  label,
  value,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
}) {
  const stepButtonClass = `flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-colors duration-150 hover:bg-white/15 motion-reduce:transition-none disabled:opacity-40 disabled:hover:bg-white/10 ${focusRing}`;

  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-white/60">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          disabled={decreaseDisabled}
          aria-label={`Decrease ${label}`}
          className={stepButtonClass}
        >
          <Minus size={20} aria-hidden />
        </button>
        <output aria-live="polite" className="flex-1 text-center text-2xl font-bold tabular-nums">
          {value}
        </output>
        <button
          type="button"
          onClick={onIncrease}
          disabled={increaseDisabled}
          aria-label={`Increase ${label}`}
          className={stepButtonClass}
        >
          <Plus size={20} aria-hidden />
        </button>
      </div>
    </div>
  );
}
