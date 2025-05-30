# Pertolo

A modern web application built with Next.js, TypeScript, Tailwind CSS, Drizzle ORM, and PostgreSQL. This project uses pnpm for package management and Docker Compose for local database development.

## Features

- Next.js App Router architecture
- TypeScript-first codebase
- Modular component structure
- PostgreSQL database with Drizzle ORM
- Tailwind CSS for styling
- API routes for backend logic
- NextAuth authentication
- Zod schema validation
- Radix UI components
- Docker Compose for local development
- Environment variable management

## Requirements

- [nvm](https://github.com/nvm-sh/nvm)
- [pnpm](https://pnpm.io/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (optional, for secrets)

## Setup

### 1. Install Node.js and pnpm

```sh
nvm use
corepack enable
corepack prepare
pnpm install
```

### 2. Set Up Local Database

Start a local PostgreSQL instance with Docker Compose:

```sh
docker compose -f devops/docker/docker-compose.db.local.yml up -d
```

Check the connection:

```sh
psql "postgresql://postgres:test1234@127.0.0.1:5432/postgres"
```

### 3. Configure Environment Variables

Copy the example file:

```sh
cp .env.example .env
```

Or fetch secrets from AWS Secrets Manager (requires AWS CLI):

```sh
aws secretsmanager get-secret-value --secret-id <secret-name> --query 'SecretString' --output text | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > .env
```

### 4. Run Database Migrations

```sh
pnpm db:migrate
```

### 5. Start the Development Server

```sh
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/                # Next.js app directory (routing, pages, API)
  components/         # Reusable UI and feature components
  db/                 # Database config, schema, migrations
  lib/                # Utility libraries
  types/              # TypeScript type definitions
  util/               # Helper functions
public/               # Static assets
devops/docker/        # Docker Compose files
```

## Scripts

- `pnpm dev` – Start the development server (with Turbopack)
- `pnpm dev:noturbo` – Start the development server (without Turbopack)
- `pnpm build` – Build the application
- `pnpm start` – Start the production server
- `pnpm lint` – Run ESLint
- `pnpm types` – Type check with TypeScript
- `pnpm format` – Format code with Prettier
- `pnpm format:check` – Check formatting with Prettier
- `pnpm db:generate` – Generate Drizzle ORM artifacts
- `pnpm db:migrate` – Run database migrations
- `pnpm db:studio` – Open Drizzle Studio
- `pnpm db:introspect` – Introspect database schema

## Technologies

- Next.js 15
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL
- NextAuth
- Zod
- Radix UI
- pnpm
- ESLint, Prettier
- Docker Compose

## License

MIT
