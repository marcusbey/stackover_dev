# StackAtlas MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a functional StackAtlas explorer app with contextual filtering, ranked tool cards, voting, and tool profiles.

**Architecture:** Next.js 15 App Router with Convex for reactive app data, Better Auth with SQLite for authentication (separate from Convex — Better Auth manages its own auth DB, Convex stores app data). Reddit-style layout: horizontal filter pills at top, card grid in center, curated sidebar on right.

**Tech Stack:** Next.js 15, Convex, Better Auth, Tailwind CSS, shadcn/ui, cmdk

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Create Next.js app**

Run:
```bash
cd /Users/marcusbey/Desktop/02-CS/05-Startup/AnyStack_dev
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

Select defaults when prompted. This scaffolds Next.js 15 with Tailwind and App Router.

**Step 2: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init -d
```

**Step 3: Add shadcn components we need**

Run:
```bash
npx shadcn@latest add button card badge command dialog scroll-area avatar separator input
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 with Tailwind and shadcn/ui"
```

---

### Task 2: Set Up Convex

**Files:**
- Create: `convex/schema.ts`, `convex/_generated/` (auto), `app/convex-client-provider.tsx`
- Modify: `app/layout.tsx`

**Step 1: Install Convex**

Run:
```bash
npm install convex
npx convex dev --once
```

This will prompt to create a new Convex project. Follow the prompts (name it "stackatlas").

**Step 2: Create the Convex schema**

Create `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  domains: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    order: v.number(),
  }).index("by_slug", ["slug"]),

  filterNodes: defineTable({
    label: v.string(),
    slug: v.string(),
    parentId: v.optional(v.id("filterNodes")),
    domainId: v.id("domains"),
    order: v.number(),
  })
    .index("by_domain", ["domainId"])
    .index("by_parent", ["parentId"])
    .index("by_slug", ["slug"]),

  tools: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    logoUrl: v.string(),
    websiteUrl: v.string(),
    type: v.union(v.literal("tool"), v.literal("saas")),
    baselineScore: v.number(),
    pros: v.array(v.string()),
    cons: v.array(v.string()),
    isHot: v.boolean(),
    isTrending: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_hot", ["isHot"])
    .index("by_trending", ["isTrending"]),

  toolFilters: defineTable({
    toolId: v.id("tools"),
    filterNodeId: v.id("filterNodes"),
  })
    .index("by_tool", ["toolId"])
    .index("by_filter", ["filterNodeId"]),

  votes: defineTable({
    visitorId: v.string(),
    toolId: v.id("tools"),
    filterNodeId: v.id("filterNodes"),
    value: v.number(),
    createdAt: v.number(),
  })
    .index("by_visitor_tool_filter", ["visitorId", "toolId", "filterNodeId"])
    .index("by_tool_filter", ["toolId", "filterNodeId"])
    .index("by_recent", ["createdAt"]),
});
```

Note: `votes.visitorId` is a string that will hold the Better Auth user ID (not a Convex ID, since users live in Better Auth's DB).

**Step 3: Create Convex client provider**

Create `app/convex-client-provider.tsx`:

```typescript
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

**Step 4: Wire provider into root layout**

Modify `app/layout.tsx` — wrap `{children}` with `<ConvexClientProvider>`.

**Step 5: Push schema to Convex**

Run:
```bash
npx convex dev --once
```

Expected: Schema deploys successfully.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Convex with full schema (domains, filterNodes, tools, votes)"
```

---

### Task 3: Set Up Better Auth

**Files:**
- Create: `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`
- Modify: `app/layout.tsx`

**Step 1: Install Better Auth**

Run:
```bash
npm install better-auth
```

**Step 2: Create auth server instance**

Create `lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: "./auth.db",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

**Step 3: Create auth client**

Create `lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
```

**Step 4: Mount auth API route**

Create `app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**Step 5: Create .env.local**

Create `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=<from convex setup>
GITHUB_CLIENT_ID=<your github oauth app id>
GITHUB_CLIENT_SECRET=<your github oauth app secret>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add `auth.db` and `.env.local` to `.gitignore`.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Better Auth with email/password and GitHub OAuth"
```

---

### Task 4: Convex Queries and Mutations

**Files:**
- Create: `convex/domains.ts`, `convex/filterNodes.ts`, `convex/tools.ts`, `convex/votes.ts`

**Step 1: Domain queries**

Create `convex/domains.ts`:

```typescript
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("domains").withIndex("by_slug").collect();
  },
});
```

**Step 2: Filter node queries**

Create `convex/filterNodes.ts`:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const byDomain = query({
  args: { domainId: v.id("domains") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("filterNodes")
      .withIndex("by_domain", (q) => q.eq("domainId", args.domainId))
      .collect();
  },
});

export const children = query({
  args: { parentId: v.id("filterNodes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("filterNodes")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .collect();
  },
});
```

**Step 3: Tools query with ranking**

Create `convex/tools.ts`:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const byFilter = query({
  args: { filterNodeId: v.id("filterNodes") },
  handler: async (ctx, args) => {
    // Get tools directly mapped to this filter
    const toolFilters = await ctx.db
      .query("toolFilters")
      .withIndex("by_filter", (q) => q.eq("filterNodeId", args.filterNodeId))
      .collect();

    const tools = await Promise.all(
      toolFilters.map(async (tf) => {
        const tool = await ctx.db.get(tf.toolId);
        if (!tool) return null;

        // Get votes for this tool in this context
        const votes = await ctx.db
          .query("votes")
          .withIndex("by_tool_filter", (q) =>
            q.eq("toolId", tf.toolId).eq("filterNodeId", args.filterNodeId)
          )
          .collect();

        const userScore = votes.reduce((sum, v) => sum + v.value, 0);
        const maxVotes = Math.max(votes.length, 1);
        const normalizedUserScore = (userScore / maxVotes) * 10;
        const finalScore =
          tool.baselineScore * 0.8 + normalizedUserScore * 0.2;

        return { ...tool, finalScore, voteCount: votes.length, userScore };
      })
    );

    return tools
      .filter(Boolean)
      .sort((a, b) => b!.finalScore - a!.finalScore);
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tools")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const hot = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tools")
      .withIndex("by_hot")
      .filter((q) => q.eq(q.field("isHot"), true))
      .take(5);
  },
});

export const trending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tools")
      .withIndex("by_trending")
      .filter((q) => q.eq(q.field("isTrending"), true))
      .take(5);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("tools").collect();
    const q = args.query.toLowerCase();
    return all
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
      .slice(0, 10);
  },
});
```

**Step 4: Vote mutation**

Create `convex/votes.ts`:

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const cast = mutation({
  args: {
    visitorId: v.string(),
    toolId: v.id("tools"),
    filterNodeId: v.id("filterNodes"),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    // Check for existing vote
    const existing = await ctx.db
      .query("votes")
      .withIndex("by_visitor_tool_filter", (q) =>
        q
          .eq("visitorId", args.visitorId)
          .eq("toolId", args.toolId)
          .eq("filterNodeId", args.filterNodeId)
      )
      .first();

    if (existing) {
      if (existing.value === args.value) {
        // Toggle off
        await ctx.db.delete(existing._id);
        return { action: "removed" };
      }
      // Change vote
      await ctx.db.patch(existing._id, {
        value: args.value,
        createdAt: Date.now(),
      });
      return { action: "changed" };
    }

    await ctx.db.insert("votes", {
      ...args,
      createdAt: Date.now(),
    });
    return { action: "created" };
  },
});

export const userVote = query({
  args: {
    visitorId: v.string(),
    toolId: v.id("tools"),
    filterNodeId: v.id("filterNodes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .withIndex("by_visitor_tool_filter", (q) =>
        q
          .eq("visitorId", args.visitorId)
          .eq("toolId", args.toolId)
          .eq("filterNodeId", args.filterNodeId)
      )
      .first();
  },
});
```

**Step 5: Push and verify**

Run:
```bash
npx convex dev --once
```

Expected: All functions deploy successfully.

**Step 6: Commit**

```bash
git add convex/
git commit -m "feat: add Convex queries (domains, filters, ranked tools, votes)"
```

---

### Task 5: Seed Data

**Files:**
- Create: `convex/seed.ts`

**Step 1: Create seed function**

Create `convex/seed.ts` with an internalMutation that:
- Creates 3 domains: AI Models, Databases, Frameworks
- Creates filter node trees for each
- Creates ~15 tools with realistic baseline scores
- Maps tools to filter nodes via toolFilters

```typescript
import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("domains").first();
    if (existing) return "Already seeded";

    // --- Domains ---
    const aiId = await ctx.db.insert("domains", {
      name: "AI Models", slug: "ai-models", icon: "brain", order: 1,
    });
    const dbId = await ctx.db.insert("domains", {
      name: "Databases", slug: "databases", icon: "database", order: 2,
    });
    const fwId = await ctx.db.insert("domains", {
      name: "Frameworks", slug: "frameworks", icon: "layers", order: 3,
    });

    // --- Filter Nodes: AI Models ---
    const aiCoding = await ctx.db.insert("filterNodes", {
      label: "Coding", slug: "coding", domainId: aiId, order: 1,
    });
    const aiFrontend = await ctx.db.insert("filterNodes", {
      label: "Frontend", slug: "frontend", parentId: aiCoding, domainId: aiId, order: 1,
    });
    const aiBackend = await ctx.db.insert("filterNodes", {
      label: "Backend", slug: "backend", parentId: aiCoding, domainId: aiId, order: 2,
    });
    const aiImageGen = await ctx.db.insert("filterNodes", {
      label: "Image Generation", slug: "image-gen", domainId: aiId, order: 2,
    });
    const aiText = await ctx.db.insert("filterNodes", {
      label: "Text & Chat", slug: "text-chat", domainId: aiId, order: 3,
    });

    // --- Filter Nodes: Databases ---
    const dbRelational = await ctx.db.insert("filterNodes", {
      label: "Relational", slug: "relational", domainId: dbId, order: 1,
    });
    const dbDocument = await ctx.db.insert("filterNodes", {
      label: "Document", slug: "document", domainId: dbId, order: 2,
    });
    const dbVector = await ctx.db.insert("filterNodes", {
      label: "Vector", slug: "vector", domainId: dbId, order: 3,
    });

    // --- Filter Nodes: Frameworks ---
    const fwFrontend = await ctx.db.insert("filterNodes", {
      label: "Frontend", slug: "fw-frontend", domainId: fwId, order: 1,
    });
    const fwBackend = await ctx.db.insert("filterNodes", {
      label: "Backend", slug: "fw-backend", domainId: fwId, order: 2,
    });
    const fwFullstack = await ctx.db.insert("filterNodes", {
      label: "Full-Stack", slug: "fw-fullstack", domainId: fwId, order: 3,
    });

    // --- Tools ---
    const gpt4 = await ctx.db.insert("tools", {
      name: "GPT-4o", slug: "gpt-4o", description: "OpenAI's most capable model for code generation, reasoning, and multimodal tasks.",
      logoUrl: "/logos/openai.svg", websiteUrl: "https://openai.com", type: "saas",
      baselineScore: 9.2, pros: ["Excellent reasoning", "Multimodal", "Large context"], cons: ["Expensive", "Rate limits"], isHot: true, isTrending: false,
    });
    const claude = await ctx.db.insert("tools", {
      name: "Claude", slug: "claude", description: "Anthropic's AI assistant excelling at code, analysis, and long-context tasks.",
      logoUrl: "/logos/anthropic.svg", websiteUrl: "https://anthropic.com", type: "saas",
      baselineScore: 9.0, pros: ["200K context", "Strong at code", "Safety-focused"], cons: ["No image generation", "Availability"], isHot: true, isTrending: true,
    });
    const gemini = await ctx.db.insert("tools", {
      name: "Gemini", slug: "gemini", description: "Google's multimodal AI model with strong coding and reasoning capabilities.",
      logoUrl: "/logos/google.svg", websiteUrl: "https://gemini.google.com", type: "saas",
      baselineScore: 8.5, pros: ["Free tier", "Multimodal", "Fast"], cons: ["Inconsistent quality", "Less reliable for complex code"], isHot: false, isTrending: true,
    });
    const copilot = await ctx.db.insert("tools", {
      name: "GitHub Copilot", slug: "github-copilot", description: "AI pair programmer integrated directly into your IDE.",
      logoUrl: "/logos/github.svg", websiteUrl: "https://github.com/features/copilot", type: "saas",
      baselineScore: 8.8, pros: ["IDE integration", "Fast completions", "Context-aware"], cons: ["Subscription cost", "Privacy concerns"], isHot: false, isTrending: false,
    });
    const cursor = await ctx.db.insert("tools", {
      name: "Cursor", slug: "cursor", description: "AI-first code editor built on VS Code with deep AI integration.",
      logoUrl: "/logos/cursor.svg", websiteUrl: "https://cursor.com", type: "saas",
      baselineScore: 8.7, pros: ["Full-file editing", "Multi-model support", "Composer mode"], cons: ["Resource heavy", "Paid for pro features"], isHot: true, isTrending: true,
    });
    const midjourney = await ctx.db.insert("tools", {
      name: "Midjourney", slug: "midjourney", description: "Leading AI image generation with unmatched aesthetic quality.",
      logoUrl: "/logos/midjourney.svg", websiteUrl: "https://midjourney.com", type: "saas",
      baselineScore: 9.1, pros: ["Best aesthetics", "Active community", "Consistent quality"], cons: ["Discord-only UX", "No API"], isHot: false, isTrending: false,
    });
    const postgres = await ctx.db.insert("tools", {
      name: "PostgreSQL", slug: "postgresql", description: "The most advanced open-source relational database.",
      logoUrl: "/logos/postgresql.svg", websiteUrl: "https://postgresql.org", type: "tool",
      baselineScore: 9.3, pros: ["Battle-tested", "Extensions ecosystem", "ACID compliant"], cons: ["Complex tuning", "Hosting required"], isHot: false, isTrending: false,
    });
    const mongodb = await ctx.db.insert("tools", {
      name: "MongoDB", slug: "mongodb", description: "Popular document database for flexible schema applications.",
      logoUrl: "/logos/mongodb.svg", websiteUrl: "https://mongodb.com", type: "tool",
      baselineScore: 8.0, pros: ["Flexible schema", "Easy to start", "Atlas cloud"], cons: ["No joins", "Consistency tradeoffs"], isHot: false, isTrending: false,
    });
    const pinecone = await ctx.db.insert("tools", {
      name: "Pinecone", slug: "pinecone", description: "Managed vector database purpose-built for AI applications.",
      logoUrl: "/logos/pinecone.svg", websiteUrl: "https://pinecone.io", type: "saas",
      baselineScore: 8.6, pros: ["Fully managed", "Fast similarity search", "Serverless"], cons: ["Vendor lock-in", "Cost at scale"], isHot: false, isTrending: true,
    });
    const supabase = await ctx.db.insert("tools", {
      name: "Supabase", slug: "supabase", description: "Open-source Firebase alternative with Postgres, Auth, and Realtime.",
      logoUrl: "/logos/supabase.svg", websiteUrl: "https://supabase.com", type: "saas",
      baselineScore: 8.9, pros: ["Postgres under hood", "Auth built-in", "Generous free tier"], cons: ["Edge functions limited", "Vendor coupling"], isHot: true, isTrending: true,
    });
    const nextjs = await ctx.db.insert("tools", {
      name: "Next.js", slug: "nextjs", description: "The React framework for production with SSR, SSG, and App Router.",
      logoUrl: "/logos/nextjs.svg", websiteUrl: "https://nextjs.org", type: "tool",
      baselineScore: 9.4, pros: ["Full-stack React", "Vercel integration", "Server Components"], cons: ["Complex config", "Vercel-optimized"], isHot: true, isTrending: false,
    });
    const react = await ctx.db.insert("tools", {
      name: "React", slug: "react", description: "The library for building user interfaces with components.",
      logoUrl: "/logos/react.svg", websiteUrl: "https://react.dev", type: "tool",
      baselineScore: 9.1, pros: ["Massive ecosystem", "Component model", "Server Components"], cons: ["Boilerplate", "Decision fatigue"], isHot: false, isTrending: false,
    });
    const express = await ctx.db.insert("tools", {
      name: "Express", slug: "express", description: "Minimal and flexible Node.js web application framework.",
      logoUrl: "/logos/express.svg", websiteUrl: "https://expressjs.com", type: "tool",
      baselineScore: 7.8, pros: ["Simple", "Huge ecosystem", "Battle-tested"], cons: ["No built-in structure", "Callback-based"], isHot: false, isTrending: false,
    });
    const nuxt = await ctx.db.insert("tools", {
      name: "Nuxt", slug: "nuxt", description: "The intuitive Vue framework for building full-stack web apps.",
      logoUrl: "/logos/nuxt.svg", websiteUrl: "https://nuxt.com", type: "tool",
      baselineScore: 8.4, pros: ["Auto-imports", "File-based routing", "SEO-friendly"], cons: ["Smaller ecosystem", "Vue dependency"], isHot: false, isTrending: false,
    });
    const v0 = await ctx.db.insert("tools", {
      name: "v0", slug: "v0", description: "Vercel's AI-powered UI generation tool using shadcn/ui components.",
      logoUrl: "/logos/v0.svg", websiteUrl: "https://v0.dev", type: "saas",
      baselineScore: 8.3, pros: ["Instant UI", "shadcn integration", "Iterative refinement"], cons: ["Limited customization", "React-only"], isHot: true, isTrending: true,
    });

    // --- Tool-Filter Mappings ---
    const mappings: [typeof gpt4, typeof aiFrontend][] = [
      // AI Models → Coding → Frontend
      [gpt4, aiFrontend], [claude, aiFrontend], [gemini, aiFrontend],
      [copilot, aiFrontend], [cursor, aiFrontend], [v0, aiFrontend],
      // AI Models → Coding → Backend
      [gpt4, aiBackend], [claude, aiBackend], [gemini, aiBackend], [copilot, aiBackend],
      // AI Models → Coding (parent)
      [gpt4, aiCoding], [claude, aiCoding], [gemini, aiCoding],
      [copilot, aiCoding], [cursor, aiCoding],
      // AI Models → Image Generation
      [midjourney, aiImageGen],
      // AI Models → Text & Chat
      [gpt4, aiText], [claude, aiText], [gemini, aiText],
      // Databases
      [postgres, dbRelational], [supabase, dbRelational],
      [mongodb, dbDocument],
      [pinecone, dbVector],
      // Frameworks
      [nextjs, fwFrontend], [react, fwFrontend], [nuxt, fwFrontend],
      [express, fwBackend],
      [nextjs, fwFullstack], [nuxt, fwFullstack], [supabase, fwFullstack],
    ];

    for (const [toolId, filterNodeId] of mappings) {
      await ctx.db.insert("toolFilters", { toolId, filterNodeId });
    }

    return "Seeded successfully";
  },
});
```

**Step 2: Run seed**

Run:
```bash
npx convex run seed:seed
```

Expected: "Seeded successfully"

**Step 3: Commit**

```bash
git add convex/seed.ts
git commit -m "feat: add seed data (3 domains, 15 tools, filter mappings)"
```

---

### Task 6: App Layout and Navigation Shell

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `components/header.tsx`, `components/domain-pills.tsx`, `components/filter-breadcrumb.tsx`

**Step 1: Build header component**

Create `components/header.tsx`:
- Logo ("StackAtlas") on the left
- Search trigger button (opens cmd+K dialog) in center
- Sign in button on right (links to `/auth/sign-in`)
- Use shadcn `Button`, `Avatar`

**Step 2: Build domain pills**

Create `components/domain-pills.tsx`:
- Client component using `useQuery(api.domains.list)`
- Horizontal scrollable row of pill buttons: [All] + each domain
- Active state styling on selected pill
- Accepts `activeDomain` and `onSelect` props
- Uses shadcn `Button` variant="outline" with active variant="default"
- Wraps in shadcn `ScrollArea` with horizontal orientation

**Step 3: Build filter breadcrumb / sub-filter chips**

Create `components/filter-breadcrumb.tsx`:
- Shows current filter path as breadcrumb (AI Models > Coding > Frontend)
- Below breadcrumb: child filter nodes as clickable chips
- Uses `useQuery(api.filterNodes.byDomain)` and `useQuery(api.filterNodes.children)`

**Step 4: Wire into layout**

Modify `app/layout.tsx`:
- ConvexClientProvider wraps everything
- Header at top
- Body area below

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add app shell with header, domain pills, filter breadcrumb"
```

---

### Task 7: Tool Card and Ranked List

**Files:**
- Create: `components/tool-card.tsx`, `components/ranked-list.tsx`, `components/vote-button.tsx`

**Step 1: Build tool card**

Create `components/tool-card.tsx`:
- shadcn `Card` displaying: tool logo (placeholder div if no image), name, score badge, type badge, short description
- Vote button in bottom-right
- Score displayed as `Badge` with number (e.g., "9.2")
- Tags showing tool type ("tool" | "saas")
- onClick navigates to `/tools/[slug]`

**Step 2: Build vote button**

Create `components/vote-button.tsx`:
- Arrow-up icon button with vote count
- Uses `useMutation(api.votes.cast)` on click
- Requires auth — if not authenticated, show toast/redirect
- Highlighted state when user has voted (use `useQuery(api.votes.userVote)`)

**Step 3: Build ranked list**

Create `components/ranked-list.tsx`:
- Client component taking `filterNodeId`
- Uses `useQuery(api.tools.byFilter, { filterNodeId })`
- Renders 3-column responsive grid of `ToolCard`s
- Shows "Top Rated" heading
- Loading skeleton state while query loads

**Step 4: Commit**

```bash
git add components/
git commit -m "feat: add tool cards, vote button, and ranked list grid"
```

---

### Task 8: Right Sidebar

**Files:**
- Create: `components/sidebar.tsx`, `components/sidebar-tool-item.tsx`

**Step 1: Build sidebar tool item**

Create `components/sidebar-tool-item.tsx`:
- Small row: tool logo (20px), tool name, brief tag
- Clickable → navigates to `/tools/[slug]`

**Step 2: Build sidebar**

Create `components/sidebar.tsx`:
- Three sections with headers: "Hot Right Now", "Recommended", "Trending"
- Uses `useQuery(api.tools.hot)` and `useQuery(api.tools.trending)`
- "Recommended" uses hot tools (same query, different section label for MVP)
- Each section renders list of `SidebarToolItem`
- Separated by `Separator` components
- Sticky position on desktop, hidden on mobile (responsive)

**Step 3: Commit**

```bash
git add components/
git commit -m "feat: add right sidebar with hot, recommended, trending tools"
```

---

### Task 9: Explorer Page Assembly

**Files:**
- Modify: `app/page.tsx`
- Create: `app/explorer-content.tsx`

**Step 1: Build the explorer page**

Create `app/explorer-content.tsx` (client component):
- State: `activeDomainId`, `activeFilterPath` (array of filter node IDs)
- Layout:
  - `DomainPills` at top
  - `FilterBreadcrumb` below (visible when domain selected)
  - Two-column layout below: main (ranked list) + sidebar
- When domain selected: fetch root filter nodes, show as sub-filter chips
- When filter node selected: push to path, show ranked list for deepest node
- Default ("All" selected): show tools from all domains (no filter applied — show hot/trending as featured)

Modify `app/page.tsx`:
- Server component that renders `<ExplorerContent />`

**Step 2: Test the full flow**

Run:
```bash
npm run dev
```

Verify:
1. Domain pills render with All, AI Models, Databases, Frameworks
2. Clicking AI Models shows Coding, Image Generation, Text & Chat chips
3. Clicking Coding shows Frontend, Backend sub-chips
4. Clicking Frontend shows ranked tool cards (GPT-4o, Claude, etc.)
5. Right sidebar shows Hot and Trending tools

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: assemble explorer page with filter → ranked list flow"
```

---

### Task 10: Tool Profile Page

**Files:**
- Create: `app/tools/[slug]/page.tsx`

**Step 1: Build tool profile page**

Create `app/tools/[slug]/page.tsx`:
- Client component (needs `useQuery`)
- Uses `useQuery(api.tools.bySlug, { slug })` to fetch tool
- Layout:
  - Large logo + tool name + type badge
  - Score badge
  - Description paragraph
  - Pros/Cons in two columns (green checkmarks / red x)
  - Website link (external, opens in new tab)
  - "Back to Explorer" link
- Vote button for this tool (needs a default filterNodeId — use first associated filter)

**Step 2: Commit**

```bash
git add app/tools/
git commit -m "feat: add tool profile page with pros/cons and voting"
```

---

### Task 11: Global Search (cmd+K)

**Files:**
- Create: `components/search-dialog.tsx`
- Modify: `components/header.tsx`

**Step 1: Build search dialog**

Create `components/search-dialog.tsx`:
- Uses shadcn `Command` + `Dialog` (CommandDialog pattern)
- Input triggers `useQuery(api.tools.search, { query })` with debounce
- Results show tool name + description
- Clicking result navigates to `/tools/[slug]`
- Keyboard shortcut: `cmd+K` / `ctrl+K`

**Step 2: Wire into header**

Modify `components/header.tsx`:
- Search button opens `SearchDialog`
- Add keyboard listener for cmd+K

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add global search with cmd+K command palette"
```

---

### Task 12: Auth Pages

**Files:**
- Create: `app/auth/sign-in/page.tsx`, `app/auth/sign-up/page.tsx`

**Step 1: Build sign-in page**

Create `app/auth/sign-in/page.tsx`:
- Form with email + password inputs (shadcn `Input`, `Button`)
- "Sign in with GitHub" button using `authClient.signIn.social({ provider: "github" })`
- Link to sign-up page
- On success redirect to `/`

**Step 2: Build sign-up page**

Create `app/auth/sign-up/page.tsx`:
- Form with name, email, password
- Uses `authClient.signUp.email()`
- Link to sign-in page
- On success redirect to `/`

**Step 3: Commit**

```bash
git add app/auth/
git commit -m "feat: add sign-in and sign-up pages with Better Auth"
```

---

### Task 13: Create Placeholder Logos

**Files:**
- Create: `public/logos/` directory with SVG placeholders

**Step 1: Create simple placeholder SVGs**

Create `public/logos/` with colored circle SVGs for each tool (openai.svg, anthropic.svg, google.svg, etc.). Simple 40x40 circles with the first letter of each tool.

**Step 2: Commit**

```bash
git add public/logos/
git commit -m "feat: add placeholder logo SVGs for seeded tools"
```

---

### Task 14: Polish and Responsive Design

**Step 1: Mobile responsiveness**

- Tool card grid: 1 column on mobile, 2 on tablet, 3 on desktop
- Sidebar: hidden on mobile, shown on `lg:` breakpoint
- Domain pills: horizontally scrollable on mobile
- Filter chips: wrap on mobile

**Step 2: Loading states**

- Add skeleton loaders for tool cards and sidebar items
- Use shadcn patterns (pulsing gray rectangles)

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: add responsive layout and loading states"
```

---

### Task 15: CLAUDE.md

**Step 1: Create CLAUDE.md at project root**

With: dev commands (`npm run dev`, `npx convex dev`), architecture overview, key file paths, conventions.

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md for Claude Code context"
```
