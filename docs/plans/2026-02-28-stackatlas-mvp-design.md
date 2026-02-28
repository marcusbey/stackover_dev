# StackAtlas MVP Design

## Overview

StackAtlas is a context-aware recommendation platform for discovering tech stacks, AI tools, and AI SaaS products. The MVP delivers a functional explorer with contextual filtering, dynamic ranking, tool profiles, and user voting.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, Server Components) |
| Auth | Better Auth |
| Database | Convex |
| Styling | Tailwind CSS + shadcn/ui |
| Search | cmdk (shadcn command palette) |

## Data Model (Convex)

```
domains        { name, slug, icon }
filterNodes    { label, slug, parentId?, domainId }
tools          { name, slug, description, logoUrl, websiteUrl, type("tool"|"saas"), baselineScore, pros[], cons[], isTrending, isHot }
toolFilters    { toolId, filterNodeId }
votes          { userId, toolId, filterNodeId, value(1|-1) }
```

## UX Layout

Reddit-style community explorer pattern:

### Top Bar
- Logo + app name
- Global search (cmd+K)
- Auth (sign in / avatar)

### Filter Bar (horizontal, below top bar)
- Scrollable domain pills: [All] [AI Models] [Databases] [Frameworks] [Hosting] [Dev Tools]
- When domain selected: sub-filter chips appear below as breadcrumb trail
- Each level drills deeper: AI Models > Coding > Frontend

### Main Content (center, card grid)
- 3-column responsive grid of tool cards
- Grouped by sections: "Top Rated", "More in {category}"
- Each card: logo, name, score badge, tags, short description, upvote button
- "Show more" pagination per section

### Right Sidebar
- Hot Right Now: tools with recent vote spikes
- Recommended: editorially curated picks
- Trending: tools gaining traction over time

### Tool Profile Page (/tools/[slug])
- Full tool detail: logo, description, categories, use cases, pros/cons
- Website link, pricing info
- Ranking per context
- Community rating + vote

## Ranking Algorithm

When user selects a filter path (e.g. AI Models > Coding > Frontend):

1. Find all tools mapped to that filter node
2. Include parent node tools at 0.5x weight
3. Compute: `finalScore = baselineScore * 0.8 + userScore * 0.2`
4. Sort descending

## Sidebar Curation

- **Hot**: tools with highest vote velocity in last 7 days
- **Recommended**: manually flagged via `isHot` field (admin)
- **Trending**: tools with consistent upward vote trend

## Seed Data

3 domains pre-populated:
- **AI Models**: Coding (Frontend, Backend), Image Gen, Text — GPT-4, Claude, Gemini, Copilot, Midjourney
- **Databases**: Relational, Document, Vector — PostgreSQL, MongoDB, Pinecone, Supabase
- **Frameworks**: Frontend, Backend, Full-stack — Next.js, React, Express, Nuxt

~15 real tools total with realistic baseline scores.

## Auth Flow

Better Auth with email/password + GitHub OAuth. Required for voting. Anonymous browsing supported.

## Pages

- `/` — Explorer (filter bar + card grid + sidebar)
- `/tools/[slug]` — Tool profile
- `/auth/sign-in` — Sign in
- `/auth/sign-up` — Sign up
