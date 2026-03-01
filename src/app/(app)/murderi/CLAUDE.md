# Murderi

A social assassination party game. Players are assigned targets in a circular kill chain; eliminating your target passes their target to you. Last player standing wins.

## Routes

| Route | Purpose |
|-------|---------|
| `/murderi` | Home — join game by code or start creation |
| `/murderi/create` | Add players (min 3), generate game code, create game |
| `/murderi/game/[gameId]` | Player selection & live game overview |
| `/murderi/game/[gameId]/[player]` | Kill order view for a specific player |
| `/murderi/game/[gameId]/share` | Share game code via WhatsApp / Email / copy |
| `/murderi/killed` | Dummy redirect back to `/murderi` |

## Game Flow

```
create → share → player-select → kill-order-view → (winner screen)
```

1. **Create** (`/murderi/create`): Admin adds players, submits → `dbCreateGame()` builds circular chain, redirects to share page.
2. **Share** (`/murderi/game/[gameId]/share`): Displays 4-letter code; share links for WhatsApp/Email.
3. **Player select** (`/murderi/game/[gameId]`): Each player claims their name (stored in `localStorage`). Polls `dbGetGameOverview()` every 5 s for live dead/alive status.
4. **Kill order** (`/murderi/game/[gameId]/[player]`): Shows the player's current target. Polls `dbGetOrderState()` every 5 s. "I have been killed" button calls `dbUpdateVictim()`.
5. **Win condition**: When `killer === victim` in the DB the winner screen is shown.

## Database

**Table: `murderi_orders`** (`src/db/schema.ts`)

```
id         uuid PK
gameId     varchar(10)   — 4-letter game code
killer     text          — this player's name
victim     text | null   — current target; null = player is dead
createdAt  timestamp
```

Circular linked list: each row is `killer → victim`. On a kill:
1. Victim's row: `victim = killer.victim` (inherits killer's target)
2. Killer's row: `victim = null` (marked dead)

`dbUpdateVictim()` runs inside a **serializable** transaction to prevent race conditions.

## Server Actions (`actions.ts`)

| Function | Description |
|----------|-------------|
| `dbCreateGame(players)` | Shuffles players, builds circular chain, returns `{ gameId }` |
| `dbGetPlayers(gameId)` | All rows for a game |
| `dbGetVictim(gameId, killer)` | Kill order row for one player |
| `dbUpdateVictim(gameId, player)` | Handle assassination; serializable transaction |
| `dbGetOrderState(gameId, player)` | `{ victim, isWinner }` — used for polling |
| `dbGetGameOverview(gameId)` | All players with alive/dead status — used for polling |
| `generateGameId()` | Random 4-letter uppercase code, retries up to 5× for uniqueness |
| `fisherYatesShuffle(arr)` | In-place Fisher-Yates shuffle |

## State / Persistence

No React context provider. State is kept in:

- **`localStorage`**
  - `murderi_saved_players` — player names remembered across sessions
  - `murderi_game_${gameId}` — which player this browser has claimed
- **Polling** — `setInterval` at 5 s in `player-select.tsx` and `player-game-view.tsx` (no WebSocket)

## Key Components

| Component | File |
|-----------|------|
| `CreateGame` | `create/page.tsx` |
| `PlayerSelect` | `game/[gameId]/player-select.tsx` |
| `PlayerGameView` | `game/[gameId]/[player]/player-game-view.tsx` |
| `KillButton` | `game/[gameId]/[player]/kill-button.tsx` |
| `ShareContent` | `game/[gameId]/share/share-content.tsx` |

## Notes

- Game code is 4 uppercase letters; uniqueness is enforced with up to 5 retries.
- `dbUpdateVictim()` throws if victim is already `null` (already dead) — guards against double-kills.
- `PlayerGameView` redirects to the overview if the saved localStorage player doesn't match the URL param.
