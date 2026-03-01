# Drink Game

A drinking task game where players take turns completing random challenges from a chosen category.

## Game Flow

```
/drink → /drink/mode → /drink/game
```

1. **`/drink`** — Player setup: add/remove players by name (min. 1, max. 20 chars, case-insensitive dedup). Navigates to `/drink/mode` on start.
2. **`/drink/mode`** — Category selection: fetches all `drinkCategory` rows from DB and displays them as cards. Selecting a category sets it in context and navigates to `/drink/game`.
3. **`/drink/game`** — Gameplay: fetches 50 random tasks for the selected category on mount, then cycles through them one by one via `showNextTask()`. Redirects back to `/drink/mode` if no category is set.

## File Structure

```
drink/
├── CLAUDE.md
├── layout.tsx          # Wraps subtree in <GameProvider>
├── game-provider.tsx   # All game state + useDrinkGame() hook
├── page.tsx            # Setup screen (server component shell)
├── add-player-form.tsx # Client component: player list + form
├── mode/
│   ├── actions.ts      # getGameModes() — fetches drinkCategoryTable
│   ├── page.tsx        # Server component: renders category list
│   └── game-mode-card.tsx  # Client component: single category card
└── game/
    ├── actions.ts      # dbGetRandomTasksByCategory(categoryId, count)
    └── page.tsx        # Client component: task fetching + GenericTaskViewer
```

## State (`game-provider.tsx`)

All state lives in `GameContext`, accessible via `useDrinkGame()`. State is **in-memory only** — navigating away from the game resets it.

| Field | Type | Description |
|---|---|---|
| `players` | `string[]` | List of player names |
| `category` | `DrinkCategoryModel \| null` | Selected game category |
| `tasks` | `DrinkTaskModel[]` | Loaded task list (50 random tasks) |
| `currentTask` | `DrinkTaskModel \| null` | Task at current index |
| `gradient` | `string` | Random Tailwind gradient string, changes on each task |
| `showNextTask()` | `() => void` | Advances index + randomizes gradient |
| `replacePlayerNames(content)` | `(string) => string` | Substitutes player name placeholders via `replaceNames()` from `@/util/tasks` |

## Server Actions

- **`mode/actions.ts`** — `getGameModes()`: returns all rows from `drinkCategoryTable`
- **`game/actions.ts`** — `dbGetRandomTasksByCategory(categoryId, count)`: returns `count` random tasks from `drinkTaskTable` for the given category, ordered by `RANDOM()`. Returns `Result<DrinkTaskModel[]>`.

## Key Patterns

- `layout.tsx` is the single place `GameProvider` is mounted — all child routes share the same context instance.
- `game/page.tsx` is a **client component** despite being a page (needs `useEffect` for data fetching and `useRouter` for redirect guard).
- `mode/page.tsx` is a **server component** — data fetching happens at render time via the server action directly.
- Task content strings may contain player name placeholders — always pass them through `replacePlayerNames()` before rendering.
