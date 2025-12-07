import type abcjs from 'abcjs';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RhythmPattern {
  pattern: string;
  length: number;
  difficulty: Difficulty[];
  category: 'basic' | 'syncopated' | 'triplet' | 'rest' | 'mixed';
}

export interface SynthInitOptions {
  visualObj: abcjs.TuneObject;
  audioContext: AudioContext;
  millisecondsPerMeasure: number;
}

export interface ExtendedSynthObjectController {
  init: (options: SynthInitOptions) => Promise<{ status: string }>;
  prime: () => Promise<{ status: string; duration: number }>;
  start: () => void;
  stop: () => void;
}

export interface DifficultyConfig {
  label: string;
  color: string;
  textColor: string;
}
