# Werewolf Game

Real-time multiplayer Werewolf (Werwolf) game with Server-Sent Events for live updates.

## Architecture

**No Context Provider** — unlike other games in this project, state lives directly in `game-room.tsx` as `useState` hooks. All persistent state is in PostgreSQL.

### Key files

| File | Purpose |
|------|---------|
| `page.tsx` | Lobby: create/join game forms |
| `actions.ts` | All server actions (create, join, start, phase transitions, actions, voting) |
| `actions/refresh.ts` | Fetch fresh `{ game, players }` from DB (called after SSE event) |
| `components/game-room.tsx` | Entire game UI (~867 lines), SSE listener, speech synthesis |
| `[gameId]/page.tsx` | Server component: load initial state, verify session, pass to GameRoom |
| `[gameId]/stream/route.ts` | SSE endpoint using PostgreSQL `LISTEN` on `werewolf_updates` channel |

## Real-time sync

```
Server action → pg_notify('werewolf_updates', gameId)
  → SSE route broadcasts to all connected clients
  → handleGameUpdate() calls refreshGameState()
  → setGame() / setPlayers() / setMe() update local state
```

## Database tables

**`werewolfGamesTable`**
- `id` — 4-letter random code (e.g. `"ABCD"`)
- `status` — `'lobby'` | `'in_progress'`
- `phase` — `'lobby'` | `'night'` | `'day'` | `'voting'`
- `rolesConfig` — json, e.g. `{ werwolf: 2, seher: 1 }`
- `ownerSessionId`

**`werewolfPlayersTable`**
- `gameId`, `sessionId`, `name`, `role`, `isAlive`, `isOwner`
- `actionTargetId` + `actionType` — reset each phase transition

## Game phases

`lobby → night → day → voting → night → ...`

**Night**: Role actions (kill, heal, peek, protect, love, role_model)
**Day**: Discussion only
**Voting**: All alive players vote; owner confirms elimination

## Roles

| Role key | German | Ability |
|----------|--------|---------|
| `werwolf` | Werwolf | Kill at night |
| `dorfbewohner` | Dorfbewohner | No ability |
| `seher` | Seherin | Peek a player's role |
| `hexe` | Hexe | Heal or kill at night |
| `jaeger` | Jäger | Shoot when dead (voting phase only) |
| `amor` | Amor | Bond two players with love |
| `heiler` | Heiler | Protect one player from death |
| `wildes_kind` | Wildes Kind | Imprints on a role model |
| `dorfdepp` | Dorfdepp | Village idiot |
| `der_alte` | Der Alte | The Elder |
| `blinzelmaedchen` | Blinzelmädchen | Partially implemented |

## Session management

- HTTP-only cookie `werewolf_session_id` (UUID, 7-day expiry)
- Session identifies both player identity and owner privileges
- All server actions verify session ownership before mutations

## Constraints / validation

- Minimum 4 players to start
- Werewolves: min 1, max `floor(players / 2)`
- Total role count must equal player count
- Phase-appropriate action validation in `submitAction()`
- Jäger (dead hunter) is the only dead player who can act

## UI conventions

- All text is **German** (labels, phases, roles, speech synthesis `de-DE`)
- Phase backgrounds: night = dark indigo, day = sky blue, voting = rose
- Dead players: grayscale + opacity-40 + skull icon
- Role colors: werewolf = red, seher = purple, hexe = emerald
- Speech synthesis announces phases (owner's browser only)
- Owner sees floating action bar with manual controls and live action log
