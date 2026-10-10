# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev          # Start dev server with Turbopack (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm types        # TypeScript type check
pnpm format       # Prettier (write)
pnpm format:check # Prettier (check only)

# Database
pnpm db:generate  # Generate Drizzle migration files
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Drizzle Studio UI

# Local DB (Docker)
docker compose -f devops/docker/docker-compose.db.local.yml up -d
```

Requires `DATABASE_URL` in `.env`. Copy `.env.example` to get started.

## Architecture

**Pertolo** is a Next.js 16 App Router application hosting multiple party/drinking games.

### Route groups

- `src/app/(app)/` — all game pages, grouped under a shared layout
  - `drink/` — drink task game: players enter names, pick a category, cycle through tasks
  - `imposter/` — impostor word game: one player gets a different word
  - `bco-trainer/` — sheet music / note trainer using `abcjs`
  - `(legal)/` — impressum / datenschutz static pages
- `src/app/api/` — REST API routes (docs served via Swagger)

### State management pattern

Each game uses a **React Context + Provider** co-located with its route:

- `game-provider.tsx` holds all game state and exports a `useXxxGame()` hook
- `actions.ts` files are Next.js Server Actions (`'use server'`) that call the database directly — no API layer for most game data
- Phase-based game flow managed in context state (e.g. `setup → reveal → playing`)

### Database

- **Drizzle ORM** with **PostgreSQL** (`postgres` driver)
- Schema: `src/db/schema.ts` — tables for drink categories/tasks and impostor words/categories
- DB instance exported from `src/db/index.ts` as `db`
- Config at `src/db/drizzle.config.ts`

### Utilities

- `src/util/types.ts` — `Result<T>` discriminated union used as return type for server actions (`{ success: true, data }` | `{ success: false, error }`)
- `src/util/tasks.ts` — player name replacement in task content strings
- `src/components/ui/` — shadcn/ui components (Radix UI primitives + Tailwind)

### Styling

Tailwind CSS v4 with `tailwindcss-animate` and `tailwind-merge`. Component variants use `class-variance-authority`. Dark theme throughout (`bg-black` root). Older games (bluff, imposter) still use gradient backgrounds; new games follow the design rules below.

## Design rules

Reference implementations: `src/app/(app)/200-questions/` and `src/app/(app)/would-you-rather/`.

New games are built on the shared kit in `src/components/game/`. It covers the setup screen (`SetupScreen`, `CategoryGrid`, `CategoryTile`, `SegmentedControl`, `LanguageToggle`, `StartButton`, `RulesLink`), `GameShell` with Quit, `EndScreen` and `PageShell`, plus the palette, the locale store, fullscreen, shuffle, `useTapGuard` and `useThemeColor`. Extend the kit instead of copying it into a game folder.

- **No emojis.** Nowhere: not in UI, content, buttons or headings.
- **No chips.** No chips, badges, pills, tags or rounded labels anywhere, not for categories, status, counts or selections. Use plain text or full tiles instead.
- **Plain and reduced.** Every element must earn its place. No decorative icons, glows or gradients. Use more space and let a page scroll rather than cramming it.
- **Spacing** follows a fixed scale: 4, 8, 16, 24, 32, 48, 64, 96 px.
- **One font**, hierarchy through size and weight only.
- **Color:** neutral chrome (black, white, grays) plus one accent for actions. Bold, solid, full-bleed colors are used as content backgrounds (one color per question or card, colored setup tiles), always with AA contrast for the text on them.
- **Game screens show only the content.** No progress, no counters, no hints, no next button. Tap anywhere to advance, with a short double-tap guard. The only controls are the Quit button and the fullscreen toggle in the header. Game screens never scroll (`h-dvh overflow-hidden`, `touch-manipulation`, `select-none`).
- **Flow:** setup, then the game directly, then an end screen. No handover or "pass the phone" interstitial screens.
- **Setup screen:** colorful category tiles, Mixed as default (all categories except sexual, exclusive with single picks, multi-select allowed), DE/EN toggle, rules link, one Start button.
- **Fullscreen and mobile:** never enter fullscreen automatically. `GameShell` shows a toggle icon (enter and exit, webkit fallback, hidden where unsupported), `appleWebApp` metadata and `viewportFit: 'cover'`, respect safe-area insets, sync the `theme-color` meta to the current background. Mobile first, works at phone width with no horizontal scroll.
- **i18n:** every game supports German and English. All UI strings live in the game's `i18n.ts`, content is stored in both languages in the DB, and the locale is persisted in localStorage with the browser language as fallback.
- **Content:** questions come in random order (Fisher-Yates per round). Content lives in seed files per category under `src/db/seed/<game>/` and is synced to the DB by an idempotent seed script.
- **Accessibility:** aria-labels on tap areas, visible focus, respect `prefers-reduced-motion`.
