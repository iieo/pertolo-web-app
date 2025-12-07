import type { Difficulty, RhythmPattern, DifficultyConfig } from './types';

const RHYTHM_PATTERNS: RhythmPattern[] = [
  // Basic patterns (Easy)
  { pattern: 'c', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
  { pattern: 'c/2 c/2', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
  {
    pattern: 'c/4 c/4 c/4 c/4',
    length: 1,
    difficulty: ['easy', 'medium', 'hard'],
    category: 'basic',
  },
  { pattern: 'c/2 c/4 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
  { pattern: 'c/4 c/4 c/2', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },
  { pattern: 'c/4 c/2 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'basic' },

  // Eighth note patterns (Easy-Medium)
  {
    pattern: 'c/2 c/8 c/8 c/4',
    length: 1,
    difficulty: ['easy', 'medium', 'hard'],
    category: 'basic',
  },
  {
    pattern: 'c/4 c/8 c/8 c/2',
    length: 1,
    difficulty: ['easy', 'medium', 'hard'],
    category: 'basic',
  },
  { pattern: 'c/8 c/8 c/8 c/8 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'basic' },
  {
    pattern: 'c/8 c/8 c/4 c/8 c/8 c/4',
    length: 1,
    difficulty: ['medium', 'hard'],
    category: 'basic',
  },

  // Sixteenth note patterns (Medium-Hard)
  {
    pattern: 'c/16 c/16 c/16 c/16 c/4 c/2',
    length: 1,
    difficulty: ['medium', 'hard'],
    category: 'basic',
  },
  {
    pattern: 'c/4 c/16 c/16 c/16 c/16 c/2',
    length: 1,
    difficulty: ['medium', 'hard'],
    category: 'basic',
  },
  {
    pattern: 'c/2 c/16 c/16 c/16 c/16 c/4',
    length: 1,
    difficulty: ['medium', 'hard'],
    category: 'basic',
  },
  {
    pattern: 'c/16 c/16 c/8 c/16 c/16 c/8 c/2',
    length: 1,
    difficulty: ['hard'],
    category: 'basic',
  },
  {
    pattern: 'c/8 c/16 c/16 c/8 c/16 c/16 c/4',
    length: 1,
    difficulty: ['hard'],
    category: 'mixed',
  },

  // Syncopated patterns (Medium-Hard)
  { pattern: 'c/4 c/2 c/4', length: 1, difficulty: ['medium', 'hard'], category: 'syncopated' },
  { pattern: 'c/8 c/4 c/8 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'syncopated' },
  { pattern: 'c/8 c/2 c/8 c/4', length: 1, difficulty: ['hard'], category: 'syncopated' },
  { pattern: 'c/4 c/8 c/4 c/8 c/4', length: 1, difficulty: ['hard'], category: 'syncopated' },
  { pattern: 'c/8 c/8 c/4 c/4 c/8 c/8', length: 1, difficulty: ['hard'], category: 'syncopated' },

  // Triplet patterns (Medium-Hard)
  { pattern: '(3c/4c/4c/4 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'triplet' },
  { pattern: 'c/2 (3c/4c/4c/4', length: 1, difficulty: ['medium', 'hard'], category: 'triplet' },
  {
    pattern: 'c/4 (3c/4c/4c/4 c/4',
    length: 1,
    difficulty: ['medium', 'hard'],
    category: 'triplet',
  },
  { pattern: '(3c/4c/4c/4 (3c/4c/4c/4', length: 1, difficulty: ['hard'], category: 'triplet' },
  { pattern: '(3c/8c/8c/8 (3c/8c/8c/8 c/2', length: 1, difficulty: ['hard'], category: 'triplet' },

  // Rest patterns (All difficulties)
  { pattern: 'z/4 c/4 c/2', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'rest' },
  { pattern: 'c/2 z/4 c/4', length: 1, difficulty: ['easy', 'medium', 'hard'], category: 'rest' },
  {
    pattern: 'c/4 z/4 c/4 c/4',
    length: 1,
    difficulty: ['easy', 'medium', 'hard'],
    category: 'rest',
  },
  { pattern: 'z/8 c/8 c/4 c/2', length: 1, difficulty: ['medium', 'hard'], category: 'rest' },
  { pattern: 'c/4 z/8 c/8 z/8 c/8 c/4', length: 1, difficulty: ['hard'], category: 'rest' },
  { pattern: 'z/4 c/8 c/8 c/4 z/4', length: 1, difficulty: ['medium', 'hard'], category: 'rest' },

  // Complex mixed patterns (Hard only)
  {
    pattern: 'c/16 c/16 c/8 c/4 c/8 c/16 c/16 c/4',
    length: 1,
    difficulty: ['hard'],
    category: 'mixed',
  },
  { pattern: '(3c/8c/8c/8 c/8 c/16 c/16 c/4', length: 1, difficulty: ['hard'], category: 'mixed' },
  { pattern: 'c/8 z/16 c/16 c/4 c/8 c/8 c/4', length: 1, difficulty: ['hard'], category: 'mixed' },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { label: 'Easy', color: 'bg-green-500', textColor: 'text-green-400' },
  medium: { label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-400' },
  hard: { label: 'Hard', color: 'bg-red-500', textColor: 'text-red-400' },
};

export function generateRhythmPattern(difficulty: Difficulty, measures: number): string {
  const availablePatterns = RHYTHM_PATTERNS.filter((p) => p.difficulty.includes(difficulty));
  let pattern = 'c/4 c/4 c/4 c/4 |';

  for (let m = 0; m < measures; m++) {
    const randomIndex = Math.floor(Math.random() * availablePatterns.length);
    const rhythmPattern = availablePatterns[randomIndex];
    if (rhythmPattern) {
      pattern += rhythmPattern.pattern;
    }

    if (m < measures - 1) {
      pattern += ' |';
    }
  }

  pattern += ' |c/4||';
  return pattern;
}

export function buildSheet(pattern: string, tempo: number): string {
  return `M: 4/4\nL:1/1\nQ:${tempo}\n|:${pattern}`;
}
