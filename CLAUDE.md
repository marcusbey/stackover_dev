# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` — Start Next.js dev server
- `npx convex dev` — Start Convex dev server (syncs schema and functions)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npx convex run seed:seed` — Seed the database (run once after connecting Convex)

Run both `npm run dev` and `npx convex dev` simultaneously for local development.

## Architecture

**Stack:** Next.js (App Router) + Convex (reactive database) + Better Auth (SQLite) + Tailwind CSS + shadcn/ui

**Two separate data stores:**
- **Convex** — All app data: domains, filter nodes, tools, tool-filter mappings, votes
- **Better Auth (SQLite)** — User accounts and sessions (`auth.db` at project root)

Auth user IDs are stored as `visitorId` strings in Convex `votes` table to bridge the two systems.

## Data Model (Convex)

- `domains` — Top-level categories (AI Models, Databases, Frameworks)
- `filterNodes` — Hierarchical filter tree with self-referencing `parentId`
- `tools` — Tool/SaaS entries with metadata, baseline scores, pros/cons
- `toolFilters` — Many-to-many join table (tools <-> filter nodes)
- `votes` — User votes scoped to tool + filter context

## Key Conventions

- All UI components are client components (`"use client"`) because they use Convex `useQuery`/`useMutation` hooks
- shadcn/ui components live in `components/ui/` — custom components in `components/`
- Convex queries/mutations are in `convex/` — import via `import { api } from "@/convex/_generated/api"`
- Path alias: `@/` maps to project root
- Ranking formula: `finalScore = baselineScore * 0.8 + normalizedUserScore * 0.2`

## Project Layout

```
app/                    # Next.js App Router pages
  explorer-content.tsx  # Main explorer (state management, layout assembly)
  tools/[slug]/         # Tool profile page
  auth/sign-in/         # Auth pages
  auth/sign-up/
  api/auth/[...all]/    # Better Auth API route
convex/                 # Convex backend
  schema.ts             # Database schema
  tools.ts              # Tool queries (byFilter, bySlug, hot, trending, search)
  votes.ts              # Vote mutation and query
  domains.ts            # Domain list query
  filterNodes.ts        # Filter node queries
  seed.ts               # Database seed data
components/             # React components
  header.tsx            # App header with search trigger
  domain-pills.tsx      # Horizontal domain filter pills
  filter-breadcrumb.tsx # Filter path breadcrumb + sub-filter chips
  ranked-list.tsx       # Ranked tool card grid
  tool-card.tsx         # Individual tool card
  vote-button.tsx       # Upvote button with Convex mutation
  sidebar.tsx           # Right sidebar (hot/recommended/trending)
  search-dialog.tsx     # Cmd+K search palette
lib/
  auth.ts               # Better Auth server config
  auth-client.ts        # Better Auth client instance
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=   # From `npx convex dev`
GITHUB_CLIENT_ID=         # GitHub OAuth app
GITHUB_CLIENT_SECRET=     # GitHub OAuth app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
