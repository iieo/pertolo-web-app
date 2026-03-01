# Imposter Game

A party word game where one or more players receive a different word than the rest. Players discuss without revealing their word, then vote to identify the imposter(s).

## Structure

```
imposter/
├── page.tsx          # Root page — wraps content in GameProvider, switches on phase
├── layout.tsx        # Next.js layout with metadata
├── game-provider.tsx # React Context + all game logic, exports useGame()
├── actions.ts        # Server Actions for DB access (categories, random word)
├── types.ts          # GamePhase, Category, GameState types
└── components/
    ├── setup-phase.tsx   # Player count, imposter count, category selection
    ├── reveal-phase.tsx  # Per-player word reveal (one device passed around)
    └── playing-phase.tsx # Discussion phase showing imposter identities on finish
```

## Game Flow

`setup` → `reveal` → `playing` → (reset to `setup`)

- **setup**: Configure players (min 3), imposter count, optional category (default: random)
- **reveal**: Each player sees their word in turn (`currentPlayerIndex` advances via `nextPlayer()`); imposters see no word (or optionally the category name if `showCategoryToImposter` is true)
- **playing**: Free discussion phase; `finishGame()` resets state back to setup while preserving player count, imposter count, and category selection

## State (`GameState`)

| Field | Description |
|---|---|
| `phase` | Current game phase |
| `players` | Array of player name strings (default `"Player N"`) |
| `imposters` | `Set<number>` of player indices assigned as imposters |
| `selectedCategoryId` | `null` = random mode (picked at `startGame`) |
| `imposterCount` | How many imposters; capped at `players.length - 1` |
| `currentPlayerIndex` | Which player is currently viewing their word in reveal phase |
| `selectedWord` | The word all non-imposters see |
| `showCategoryToImposter` | Whether imposters are shown the category name |

## Server Actions (`actions.ts`)

- `dbGetCategories()` — fetches all rows from `imposterCategoriesTable`
- `dbGetRandomWord(categoryId)` — returns one random row from `impostorWordsTable` for the given category

## Key Constraints

- Minimum 3 players (`setPlayerCount` enforces this)
- `imposterCount` must be less than total player count (validated in `startGame`)
- If no category is selected, a random one is chosen at game start (not at setup time)
- `finishGame()` preserves session preferences (players, imposterCount, selectedCategoryId, showCategoryToImposter) so repeated rounds need minimal reconfiguration
