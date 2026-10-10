import { shuffle } from '@/components/game/shuffle';

import { generateDistractors, generateRhythm, type Level, type Rhythm, rhythmKey } from './rhythm';

const MAX_ATTEMPTS = 8;

// Avoids playing the same rhythm twice in a row where the level allows it.
export function nextRhythm(level: Level, measures: number, previous?: Rhythm): Rhythm {
  let rhythm = generateRhythm(level, measures);
  if (!previous) return rhythm;
  const previousKey = rhythmKey(previous);
  for (let i = 1; i < MAX_ATTEMPTS && rhythmKey(rhythm) === previousKey; i++) {
    rhythm = generateRhythm(level, measures);
  }
  return rhythm;
}

export type QuizRound = { target: Rhythm; options: Rhythm[]; correctIndex: number };

export function createQuizRound(level: Level, measures: number, previous?: Rhythm): QuizRound {
  const target = nextRhythm(level, measures, previous);
  const options = shuffle([target, ...generateDistractors(target, level, 2)]);
  return { target, options, correctIndex: options.indexOf(target) };
}
