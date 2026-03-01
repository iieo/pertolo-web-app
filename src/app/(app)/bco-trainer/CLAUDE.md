# BCO Trainer

A rhythm reading trainer that generates random sheet music patterns and plays them back via audio synthesis.

## What it does

- Generates random rhythm patterns in 4/4 time using `abcjs` ABC notation
- Renders sheet music in the browser
- Plays back patterns via the Web Audio API (`abcjs.synth`)
- Lets the user configure difficulty, tempo (BPM), and number of measures

## File structure

```
bco-trainer/
├── page.tsx              # Main page — all state lives here (no context/provider)
├── types.ts              # Shared types: Difficulty, RhythmPattern, synth interfaces
├── utils.ts              # Pattern data (RHYTHM_PATTERNS) + generateRhythmPattern / buildSheet
├── settings-panel.tsx    # Difficulty / tempo / measures controls
└── components/
    ├── header.tsx        # Page title
    ├── sheet-music-card.tsx  # abcjs render target, blur overlay when hidden
    └── action-buttons.tsx    # Play / Stop / Show / Reload buttons
```

## Key details

### State (all in `page.tsx`)

| State | Default | Description |
|---|---|---|
| `difficulty` | `'medium'` | Filters which patterns are eligible |
| `tempo` | `75` | BPM, range 40–200 (step 5) |
| `measures` | `2` | How many measures to generate, range 1–8 |
| `isPlaying` | `false` | Synth is active |
| `isPaperVisible` | `false` | Sheet music visible vs. blurred |

Refs hold the `abcjs` visual object, the synth controller, and the `AudioContext` (kept alive across plays to avoid re-creation).

### ABC notation

Patterns use middle-C (`c`) as a placeholder note — BCO Trainer is a **rhythm** trainer only, not pitch. `buildSheet` wraps the pattern in a minimal ABC header:

```
M: 4/4
L:1/1
Q:<tempo>
|:<pattern>
```

`generateRhythmPattern` prepends a fixed `c/4 c/4 c/4 c/4 |` count-in measure and appends `|c/4||` as the final note.

### Rhythm patterns (`utils.ts`)

`RHYTHM_PATTERNS` is a static array of `RhythmPattern` objects. Each has:
- `pattern` — ABC notation string for one measure
- `difficulty` — which difficulties this pattern is eligible for
- `category` — `basic | syncopated | triplet | rest | mixed`

To add new patterns, append entries to `RHYTHM_PATTERNS`. Difficulty filtering happens in `generateRhythmPattern`.

### Audio

Uses `abcjs.synth.CreateSynth`. The `AudioContext` is created lazily on first play and reused. A silent oscillator is started immediately to unlock audio on iOS Safari.

Settings controls are disabled while `isPlaying` is true to prevent state mismatches with the active synth.
