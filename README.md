# Clube do Livro Caxias

A book club website that centralizes the collection of books read, reading statistics, and AI-powered personalized reading suggestions.

## Features

- **Home page** — club logo, reading statistics, and a year-by-year summary
- **Archive** — full book collection with filtering by year and ratings
- **Suggestions** — AI-generated reading recommendations based on the club's history

## Tech Stack

### Monorepo

- **pnpm workspaces** — package and workspace management
- **Node.js 24** — runtime
- **TypeScript 5.9** — static typing across all packages

### Backend (API)

- **Express 5** — HTTP server
- **PostgreSQL + Drizzle ORM** — relational database with typed ORM
- **Zod (zod/v4)** — schema validation
- **drizzle-zod** — Zod schema generation from Drizzle tables
- **OpenAI via Replit AI Integrations** — AI reading recommendations (model gpt-5.1)
- **pino + pino-http** — structured JSON logging
- **esbuild** — server build (CJS bundle)

### Frontend

- **React 19** — UI library
- **Vite** — bundler and dev server
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible UI components
- **TanStack React Query** — async state management and caching
- **wouter** — lightweight client-side routing
- **Orval** — React Query hooks and Zod schemas generated from the OpenAPI spec

### API Contract

- **OpenAPI 3.1** — spec located at `lib/api-spec/openapi.yaml`
- Codegen automatically produces typed hooks and schemas for both frontend and backend

## Project Structure

```
artifacts/
  api-server/        → Express API (port 8080, served under /api)
  book-club/         → React + Vite frontend (port configured via $PORT)
lib/
  api-spec/                        → OpenAPI spec (source of truth)
  api-client-react/                → Generated React Query hooks (do not edit manually)
  api-zod/                         → Generated Zod schemas (do not edit manually)
  db/                              → Drizzle schema + PostgreSQL client
  integrations-openai-ai-server/   → Pre-configured OpenAI client
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with logo, club statistics, and year summary |
| `/arquivo` | Full archive with year and rating filters |
| `/sugestoes` | AI-generated reading recommendations |

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL (or set `DATABASE_URL` to point to an existing database)

### Environment Variables

```env
DATABASE_URL=                         # PostgreSQL connection string
SESSION_SECRET=                       # Session secret
AI_INTEGRATIONS_OPENAI_BASE_URL=      # Provided by Replit AI Integrations
AI_INTEGRATIONS_OPENAI_API_KEY=       # Provided by Replit AI Integrations
```

### Installation

```bash
pnpm install
```

### Database Setup

```bash
# Create tables
pnpm --filter @workspace/db run push
```

### Running in Development

The frontend requires `PORT` and `BASE_PATH` to start — without them Vite will throw an error and CSS won't load. Set them before running:

```bash
# Terminal 1 — API
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (required env vars)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/book-club run dev
```

Alternatively, create a `.env` file inside `artifacts/book-club/`:

```env
PORT=3000
BASE_PATH=/
```

The API runs on port `8080` under the `/api` prefix.  
The frontend runs at `http://localhost:3000` (or whichever port you set in `PORT`).

### Production Build

```bash
pnpm run build
```

### Other Useful Commands

```bash
# Full typecheck across all packages
pnpm run typecheck

# Regenerate hooks and schemas from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Force-push the database schema (useful for column conflicts)
pnpm --filter @workspace/db run push-force
```

## Architecture

- The API contract is defined first in the OpenAPI spec (`lib/api-spec/openapi.yaml`); types are generated via Orval — never write types manually for existing endpoints.
- The frontend uses only the generated hooks (`@workspace/api-client-react`) for API calls.
- The server validates inputs and outputs with the generated Zod schemas (`@workspace/api-zod`).
- AI recommendations are generated server-side to protect credentials and avoid client-side latency.
- Do not use `console.log` in server code — use `req.log` inside route handlers and the `logger` singleton outside request context.

## Gotchas

- Never manually edit files in `lib/api-client-react/src/generated/` or `lib/api-zod/src/generated/` — they are overwritten by codegen.
- After editing the OpenAPI spec, always run `pnpm --filter @workspace/api-spec run codegen`.
- Do not run `pnpm run dev` at the monorepo root — each artifact must be started individually or via Replit workflows.
- The `@import url(...)` for Google Fonts must be the **first line** of `index.css`, before `@import "tailwindcss"`.
