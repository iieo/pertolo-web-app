# Quiz Route — Blind Maze

Despite the route name `/quiz`, this is the **Blind Maze** game: a daily puzzle where the maze layout is invisible and players navigate by trial and error.

## Files

| File | Role |
|------|------|
| `page.tsx` | Thin server component, renders `<MazeClient />` |
| `layout.tsx` | Sets page metadata (`title: 'Blind Maze'`) |
| `maze-client.tsx` | All game logic and UI — single client component |
| `src/lib/maze.ts` | Maze generation library (no UI, no React) |

## Public Assets

`public/quiz/` — three PNG sprites used via `next/image`:
- `player.png` — player token
- `wall.png` — revealed wall (shown after a collision)
- `goal.png` — exit marker

## How the Maze Works (`src/lib/maze.ts`)

- **Deterministic**: date string (`YYYY-MM-DD`) is hashed into a seed for the `mulberry32` PRNG. All players get the same maze on the same day.
- **Generation**: recursive DFS on a `5×5` cell grid → produces an `11×11` boolean grid (`true` = walkable, `false` = wall).
- **Start**: right edge (random row); **End**: left edge (random row).
- **Day counter**: epoch is `2026-01-01`; `getMazeDay()` returns days since then + 1.

Key types:
```ts
type Cell = boolean;          // true = path, false = wall
type Grid = Cell[][];
type Position = { x: number; y: number };
type MazeData = { grid, start, end, width, height };
```

## Game State (`maze-client.tsx`)

```ts
type GameState = 'playing' | 'won';
```

State tracked per session (no persistence — resets on page reload):
- `playerPos` — current grid position
- `deaths` — wall collision count
- `steps` — successful move count
- `discoveredWalls` — `Set<"x,y">` of walls the player has hit (rendered visually)
- `shakeCount` — incremented on collision to trigger shake animation

## Controls

| Input | Action |
|-------|--------|
| `ArrowUp` / `w` | Move up |
| `ArrowDown` / `s` | Move down |
| `ArrowLeft` / `a` | Move left |
| `ArrowRight` / `d` | Move right |
| Swipe | Direction with ≥30px threshold |

## Movement Logic

1. Compute `(nx, ny)` from current position + delta.
2. If out-of-bounds AND matches `maze.end` → win.
3. If `grid[ny][nx] === false` → collision: increment deaths, add to `discoveredWalls`, reset player to `maze.start`.
4. If `(nx, ny) === maze.end` → win.
5. Otherwise → update `playerPos`, increment steps.

## No Database / No Server Actions

This game has **no server actions and no database interaction**. State is entirely client-side and ephemeral. There is nothing to persist.

## Win Screen

Shows deaths + steps. A "Ergebnis kopieren" button copies a shareable result string to clipboard (no share API, clipboard only).

## Styling Notes

- Background: `#1a1423` (deep purple-black)
- Accent: purple-to-pink gradient (`from-purple-400 to-pink-600`)
- Grid cells: `#2a2438`, `28px` mobile / `40px` desktop
- Player is positioned with a `motion.div` overlay using CSS var `--p-offset` for padding compensation
- Shake animation on collision via framer-motion `key={shakeCount}` trick
