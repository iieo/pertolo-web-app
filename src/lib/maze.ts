/**
 * Daily Blind Maze Generator
 *
 * Generates a deterministic maze from a date seed so every player
 * gets the same maze on the same day.
 */

export type Cell = boolean; // true = path, false = wall
export type Grid = Cell[][];
export type Position = { x: number; y: number };

export type MazeData = {
  grid: Grid;
  start: Position;
  end: Position;
  width: number;
  height: number;
};

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateToSeed(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ── Shuffle helper ───────────────────────────────────────────────

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// ── DFS Maze Generator ──────────────────────────────────────────
//
// Works on a grid where each "cell" in the maze occupies a 2×2 block
// in the underlying boolean grid, with walls between them.
//
// Grid layout (for a 3-cell-wide maze):
//   W W W W W W W
//   W C W C W C W
//   W W W W W W W
//   W C W C W C W
//   W W W W W W W
//
// The boolean grid size for cellsX × cellsY cells is:
//   width  = cellsX * 2 + 1
//   height = cellsY * 2 + 1

function generateMazeGrid(cellsX: number, cellsY: number, rng: () => number): Grid {
  const width = cellsX * 2 + 1;
  const height = cellsY * 2 + 1;

  // Start with all walls
  const grid: Grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false),
  );

  // Mark all cell positions as path
  for (let cy = 0; cy < cellsY; cy++) {
    for (let cx = 0; cx < cellsX; cx++) {
      grid[cy * 2 + 1]![cx * 2 + 1] = true;
    }
  }

  // DFS to carve passages
  const visited = Array.from({ length: cellsY }, () => Array.from({ length: cellsX }, () => false));

  const directions: [number, number][] = [
    [0, -1], // up
    [0, 1], // down
    [-1, 0], // left
    [1, 0], // right
  ];

  function dfs(cx: number, cy: number) {
    visited[cy]![cx] = true;
    const shuffled = shuffle(directions, rng);

    for (const [dx, dy] of shuffled) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < cellsX && ny >= 0 && ny < cellsY && !visited[ny]![nx]) {
        // Remove wall between current cell and neighbor
        const wallX = cx * 2 + 1 + dx;
        const wallY = cy * 2 + 1 + dy;
        grid[wallY]![wallX] = true;
        dfs(nx, ny);
      }
    }
  }

  // Start DFS from a random cell
  const startCx = Math.floor(rng() * cellsX);
  const startCy = Math.floor(rng() * cellsY);
  dfs(startCx, startCy);

  return grid;
}

// ── Public API ───────────────────────────────────────────────────

export function generateMaze(cellsX: number, cellsY: number, seed: number): MazeData {
  const rng = mulberry32(seed);
  const grid = generateMazeGrid(cellsX, cellsY, rng);

  const width = cellsX * 2 + 1;
  const height = cellsY * 2 + 1;

  // Pick start on the right edge (random row that is a cell, not a wall)
  const rightCells: number[] = [];
  for (let y = 1; y < height; y += 2) {
    rightCells.push(y);
  }
  const startY = rightCells[Math.floor(rng() * rightCells.length)]!;
  const start: Position = { x: width - 1, y: startY };
  // Open the right wall for the start
  grid[startY]![width - 1] = true;

  // Pick end on the left edge (random row that is a cell)
  const leftCells: number[] = [];
  for (let y = 1; y < height; y += 2) {
    leftCells.push(y);
  }
  const endY = leftCells[Math.floor(rng() * leftCells.length)]!;
  const end: Position = { x: 0, y: endY };
  // Open the left wall for the end
  grid[endY]![0] = true;

  return { grid, start, end, width, height };
}

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodaysMaze(): MazeData {
  const dateString = getTodayDateString();
  const seed = dateToSeed(dateString);
  // 5×5 cells → 11×11 grid (good balance of difficulty)
  return generateMaze(5, 5, seed);
}

/** Day number since an arbitrary epoch, for display purposes */
export function getMazeDay(): number {
  const epoch = new Date('2026-01-01').getTime();
  const now = new Date().getTime();
  return Math.floor((now - epoch) / (1000 * 60 * 60 * 24)) + 1;
}
