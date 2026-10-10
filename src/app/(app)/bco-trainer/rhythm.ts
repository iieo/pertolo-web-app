export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const LEVELS: readonly Level[] = [1, 2, 3, 4, 5, 6];

export const BEATS_PER_MEASURE = 4;

export type Note = { duration: number; rest: boolean };

export type Rhythm = { measures: Note[][]; abc: string[] };

export type TimedNote = { index: number; start: number; duration: number; rest: boolean };

type CellId =
  | 'q'
  | 'qr'
  | 'h'
  | 'w'
  | 'ee'
  | 'ze'
  | 'ez'
  | 'dqe'
  | 'ssss'
  | 'ess'
  | 'sse'
  | 'ds'
  | 'sd'
  | 'ses'
  | 'eqe'
  | 'zsss'
  | 't'
  | 'qt';

type Cell = {
  id: CellId;
  span: 1 | 2 | 4;
  level: Level;
  weight: number;
  rest: boolean;
  abc: string;
  notes: Note[];
};

const n = (duration: number): Note => ({ duration, rest: false });
const r = (duration: number): Note => ({ duration, rest: true });

// All notes use B, which abcjs puts on the single line of the percussion staff (pitch 6).
const CELLS: readonly Cell[] = [
  { id: 'q', span: 1, level: 1, weight: 4, rest: false, abc: 'B4', notes: [n(1)] },
  { id: 'qr', span: 1, level: 1, weight: 1.5, rest: true, abc: 'z4', notes: [r(1)] },
  { id: 'h', span: 2, level: 1, weight: 1.5, rest: false, abc: 'B8', notes: [n(2)] },
  { id: 'w', span: 4, level: 1, weight: 0.3, rest: false, abc: 'B16', notes: [n(4)] },
  { id: 'ee', span: 1, level: 2, weight: 3, rest: false, abc: 'B2B2', notes: [n(0.5), n(0.5)] },
  { id: 'ze', span: 1, level: 3, weight: 1.5, rest: true, abc: 'z2 B2', notes: [r(0.5), n(0.5)] },
  { id: 'ez', span: 1, level: 3, weight: 1, rest: true, abc: 'B2 z2', notes: [n(0.5), r(0.5)] },
  { id: 'dqe', span: 2, level: 3, weight: 2, rest: false, abc: 'B6 B2', notes: [n(1.5), n(0.5)] },
  {
    id: 'ssss',
    span: 1,
    level: 4,
    weight: 2,
    rest: false,
    abc: 'BBBB',
    notes: [n(0.25), n(0.25), n(0.25), n(0.25)],
  },
  {
    id: 'ess',
    span: 1,
    level: 4,
    weight: 2,
    rest: false,
    abc: 'B2BB',
    notes: [n(0.5), n(0.25), n(0.25)],
  },
  {
    id: 'sse',
    span: 1,
    level: 4,
    weight: 2,
    rest: false,
    abc: 'BBB2',
    notes: [n(0.25), n(0.25), n(0.5)],
  },
  { id: 'ds', span: 1, level: 5, weight: 2, rest: false, abc: 'B3B', notes: [n(0.75), n(0.25)] },
  { id: 'sd', span: 1, level: 5, weight: 1.5, rest: false, abc: 'BB3', notes: [n(0.25), n(0.75)] },
  {
    id: 'ses',
    span: 1,
    level: 5,
    weight: 1.5,
    rest: false,
    abc: 'BB2B',
    notes: [n(0.25), n(0.5), n(0.25)],
  },
  {
    id: 'eqe',
    span: 2,
    level: 5,
    weight: 1.5,
    rest: false,
    abc: 'B2 B4 B2',
    notes: [n(0.5), n(1), n(0.5)],
  },
  {
    id: 'zsss',
    span: 1,
    level: 5,
    weight: 1,
    rest: true,
    abc: 'z BBB',
    notes: [r(0.25), n(0.25), n(0.25), n(0.25)],
  },
  {
    id: 't',
    span: 1,
    level: 6,
    weight: 2.5,
    rest: false,
    abc: '(3B2B2B2',
    notes: [n(1 / 3), n(1 / 3), n(1 / 3)],
  },
  {
    id: 'qt',
    span: 2,
    level: 6,
    weight: 1.5,
    rest: false,
    abc: '(3B4B4B4',
    notes: [n(2 / 3), n(2 / 3), n(2 / 3)],
  },
];

const EPS = 1e-6;

function cellsFor(level: Level): Cell[] {
  return CELLS.filter((cell) => cell.level <= level);
}

// New cells of the current level dominate, the previous level still shows up, older ones fade.
function weightOf(cell: Cell, level: Level): number {
  const age = level - cell.level;
  const factor = age === 0 ? (level === 1 ? 1 : 3) : age === 1 ? 1.5 : 0.7;
  const quarterDamp = cell.id === 'q' && level >= 3 ? 0.6 : 1;
  return cell.weight * factor * quarterDamp;
}

function fitsAt(cell: Cell, position: number): boolean {
  if (position + cell.span > BEATS_PER_MEASURE) return false;
  if (cell.span === 2) return position % 2 === 0;
  if (cell.span === 4) return position === 0;
  return true;
}

function pickWeighted<T>(items: T[], weight: (item: T) => number): T {
  const total = items.reduce((sum, item) => sum + weight(item), 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= weight(item);
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function measureOk(cells: Cell[], level: Level): boolean {
  if (cells.every((cell) => cell.notes.every((note) => note.rest))) return false;
  const restCells = cells.filter((cell) => cell.rest).length;
  if (level <= 3 && restCells > 1) return false;
  if (restCells > 2) return false;
  if (level >= 2 && cells.every((cell) => cell.id === 'q' || cell.id === 'qr')) return false;
  return true;
}

function randomMeasure(level: Level): Cell[] {
  const pool = cellsFor(level);
  const cells: Cell[] = [];
  let position = 0;
  while (position < BEATS_PER_MEASURE) {
    const candidates = pool.filter((cell) => fitsAt(cell, position));
    const cell = pickWeighted(candidates, (c) => weightOf(c, level));
    cells.push(cell);
    position += cell.span;
  }
  return cells;
}

function cellById(id: CellId): Cell {
  const cell = CELLS.find((c) => c.id === id);
  if (!cell) throw new Error(`Unknown cell ${id}`);
  return cell;
}

function fallbackMeasure(level: Level): Cell[] {
  if (level === 1) return [cellById('h'), cellById('q'), cellById('q')];
  const newest = cellsFor(level).filter((cell) => cell.level === level && cell.span === 1);
  const accent = newest.find((cell) => !cell.rest) ?? cellById('ee');
  return [accent, cellById('q'), cellById('q'), cellById('q')];
}

function cellsKey(cells: Cell[]): string {
  return cells.map((cell) => cell.id).join(',');
}

function generateMeasure(level: Level, avoid?: string): Cell[] {
  for (let attempt = 0; attempt < 80; attempt++) {
    const cells = randomMeasure(level);
    if (measureOk(cells, level) && cellsKey(cells) !== avoid) return cells;
  }
  return fallbackMeasure(level);
}

function buildRhythm(measures: Cell[][]): Rhythm {
  const rhythm: Rhythm = {
    measures: measures.map((cells) =>
      cells.flatMap((cell) => cell.notes.map((note) => ({ ...note }))),
    ),
    abc: measures.map((cells) => cells.map((cell) => cell.abc).join(' ')),
  };
  if (process.env.NODE_ENV !== 'production') {
    for (const notes of rhythm.measures) {
      const sum = notes.reduce((total, note) => total + note.duration, 0);
      if (Math.abs(sum - BEATS_PER_MEASURE) > EPS) {
        throw new Error(`Measure sums to ${sum} beats instead of ${BEATS_PER_MEASURE}`);
      }
    }
  }
  return rhythm;
}

// Reconstructs the cells of a measure from its notes. Cell note sequences are prefix free,
// so a greedy match at each beat-aligned position is unambiguous.
function parseCells(notes: Note[]): Cell[] | null {
  const cells: Cell[] = [];
  let index = 0;
  let position = 0;
  while (index < notes.length) {
    const cell = CELLS.find(
      (c) =>
        fitsAt(c, position) &&
        c.notes.every((note, i) => {
          const other = notes[index + i];
          return (
            other !== undefined &&
            other.rest === note.rest &&
            Math.abs(other.duration - note.duration) < EPS
          );
        }),
    );
    if (!cell) return null;
    cells.push(cell);
    index += cell.notes.length;
    position += cell.span;
  }
  return position === BEATS_PER_MEASURE ? cells : null;
}

export function generateRhythm(level: Level, measures: number): Rhythm {
  const result: Cell[][] = [];
  for (let i = 0; i < Math.max(1, measures); i++) {
    const previous = result[i - 1];
    result.push(generateMeasure(level, previous ? cellsKey(previous) : undefined));
  }
  return buildRhythm(result);
}

export function rhythmKey(rhythm: Rhythm): string {
  return rhythm.measures
    .map((notes) =>
      notes.map((note) => `${note.rest ? 'r' : 'n'}${Math.round(note.duration * 12)}`).join('.'),
    )
    .join('|');
}

function mutate(cells: Cell[][], level: Level): Cell[][] | null {
  const pool = cellsFor(level);
  const next = cells.map((measure) => [...measure]);
  const replacements = Math.random() < 0.65 ? 1 : 2;
  let done = 0;
  for (let attempt = 0; attempt < 20 && done < replacements; attempt++) {
    const m = Math.floor(Math.random() * next.length);
    const c = Math.floor(Math.random() * next[m].length);
    const current = next[m][c];
    const position = next[m].slice(0, c).reduce((sum, cell) => sum + cell.span, 0);
    const options = pool.filter(
      (cell) => cell.span === current.span && cell.id !== current.id && fitsAt(cell, position),
    );
    if (options.length === 0) continue;
    const replacement = pickWeighted(options, (cell) => weightOf(cell, level));
    const measure = [...next[m]];
    measure[c] = replacement;
    if (!measureOk(measure, level) && measureOk(next[m], level)) continue;
    next[m] = measure;
    done++;
  }
  return done > 0 ? next : null;
}

export function generateDistractors(rhythm: Rhythm, level: Level, count: number): Rhythm[] {
  const parsed = rhythm.measures.map(parseCells);
  const original: Cell[][] = parsed.every((cells) => cells !== null)
    ? (parsed as Cell[][])
    : rhythm.measures.map(() => generateMeasure(level));

  const seen = new Set<string>([rhythmKey(rhythm)]);
  const result: Rhythm[] = [];
  const accept = (candidate: Rhythm) => {
    const key = rhythmKey(candidate);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(candidate);
  };

  for (let attempt = 0; attempt < count * 40 && result.length < count; attempt++) {
    const mutated = mutate(original, level);
    if (mutated) accept(buildRhythm(mutated));
  }
  for (let attempt = 0; attempt < count * 40 && result.length < count; attempt++) {
    const replaced = original.map((measure) => [...measure]);
    const m = Math.floor(Math.random() * replaced.length);
    replaced[m] = generateMeasure(level);
    accept(buildRhythm(replaced));
  }
  for (let attempt = 0; attempt < count * 40 && result.length < count; attempt++) {
    accept(generateRhythm(level, rhythm.measures.length));
  }
  return result;
}

export function toAbc(rhythm: Rhythm, measuresPerLine: number): string {
  const perLine = Math.max(1, Math.floor(measuresPerLine));
  const lines: string[] = [];
  for (let i = 0; i < rhythm.abc.length; i += perLine) {
    const chunk = rhythm.abc.slice(i, i + perLine).join(' | ');
    const isLast = i + perLine >= rhythm.abc.length;
    lines.push(`${chunk} ${isLast ? '|]' : '|'}`);
  }
  return [
    'X:1',
    'M:4/4',
    'L:1/16',
    'K:C clef=perc stafflines=1',
    'V:1 clef=perc stafflines=1 stem=up',
    ...lines,
  ].join('\n');
}

export function toTimeline(rhythm: Rhythm): TimedNote[] {
  const timeline: TimedNote[] = [];
  let index = 0;
  rhythm.measures.forEach((notes, m) => {
    let start = m * BEATS_PER_MEASURE;
    for (const note of notes) {
      timeline.push({ index, start, duration: note.duration, rest: note.rest });
      index++;
      start += note.duration;
    }
  });
  return timeline;
}
