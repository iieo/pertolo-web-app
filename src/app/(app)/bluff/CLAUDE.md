# Bluff Game

**Dictionary Bluff** — a party game where a player reads out a rare word and either recites the real definition (truth) or invents a convincing fake one (bluff). The group votes; if they guess wrong, the player wins the round.

## Game flow

```
word → (player taps "Aufdecken") → secret → (player taps "Nächstes Wort") → word → …
```

- **word phase** (`word-phase.tsx`): shows the current word + pronunciation. Player reads it aloud, then secretly taps to reveal their role.
- **secret phase** (`secret-phase.tsx`): shows `WAHRHEIT` (truth) or `BLUFF!` randomly assigned (50/50). Truth → real definition shown; Bluff → player must invent a definition on the spot (real definition shown dimmed for later reveal).

## State

All game state lives in `game-provider.tsx` via `GameContext`. Hook: `useBluffGame()`.

| Field | Type | Description |
|---|---|---|
| `phase` | `GamePhase` | Current phase: `'word'` or `'secret'` |
| `currentWord` | `Word` | Active word object |
| `secretType` | `SecretType \| null` | `'truth'` or `'bluff'`, null during word phase |
| `revealSecret()` | fn | Randomly assigns truth/bluff, advances to secret phase |
| `nextWord()` | fn | Picks next non-repeated word, resets to word phase |

Word cycling avoids repeats until all words are exhausted, then resets.

## Types (`types.ts`)

```ts
type GamePhase = 'word' | 'secret';
type SecretType = 'truth' | 'bluff';
type Word = { word: string; pronunciation: string; definition: string };
```

## Data

Words are fetched **once server-side** in `page.tsx` from `bluffWordsTable` and passed to `<BluffClient words={words} />`. There are no server actions — all game logic is purely client-side state.

## Styling conventions

- **Word phase**: violet theme (`violet-600`, `violet-950` gradient)
- **Truth (secret phase)**: emerald theme (`emerald-600`, `emerald-950` gradient)
- **Bluff (secret phase)**: rose theme (`rose-600`, `rose-950` gradient)
- Max width `md:max-w-lg md:mx-auto` — centered on desktop, full-width on mobile
- Dynamic font size via `clamp()` inline style for long words

## UI language

All visible text is **German** (e.g. "Dein Wort", "Aufdecken", "Wahrheit", "Nächstes Wort").
