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

Tailwind CSS v4 with `tailwindcss-animate` and `tailwind-merge`. Component variants use `class-variance-authority`. Dark theme throughout (`bg-black` root, gradient backgrounds per game).
