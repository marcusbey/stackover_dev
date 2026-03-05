# SEO Phase 1: Technical Foundation for stackover.dev

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add complete SEO infrastructure to stackover.dev — metadata, sitemap, robots.txt, structured data (JSON-LD), Open Graph/Twitter cards, and refactor tool pages for server-side metadata generation.

**Architecture:** The tool profile page (`/tools/[slug]`) must be split into a server component (for `generateMetadata` + JSON-LD) wrapping a client component (for Convex reactive UI). All new pages use `fetchQuery` from `convex/nextjs` for server-side data fetching. Root layout gets `metadataBase`, brand rename, and global OG defaults.

**Tech Stack:** Next.js 16 App Router, Convex (`fetchQuery` / `preloadQuery`), TypeScript, JSON-LD via `<script type="application/ld+json">`

**Note on JSON-LD:** The `dangerouslySetInnerHTML` usage for JSON-LD is safe here because we control the data source (Convex database) and all values are serialized through `JSON.stringify()` which escapes any HTML entities. This is the [recommended Next.js pattern](https://nextjs.org/docs/app/guides/json-ld).

---

### Task 1: Update Root Layout — Brand, metadataBase, Global SEO Metadata

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update the root layout metadata**

Replace the entire metadata export and add metadataBase in `app/layout.tsx`:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://stackover.dev"),
  title: {
    default: "stackover.dev — Discover the Best AI Tools, Templates & Agents",
    template: "%s | stackover.dev",
  },
  description:
    "Compare 2,400+ AI tools, developer templates, and agents. Community-ranked with real votes. Find the right stack for what you're building.",
  keywords: [
    "AI tools",
    "developer tools",
    "startup tools",
    "AI agents",
    "AI templates",
    "tech stack",
    "SaaS tools",
    "best AI tools 2026",
  ],
  openGraph: {
    type: "website",
    siteName: "stackover.dev",
    title: "stackover.dev — Discover the Best AI Tools, Templates & Agents",
    description:
      "Compare 2,400+ AI tools, developer templates, and agents. Community-ranked with real votes.",
    url: "https://stackover.dev",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "stackover.dev — Discover the Best AI Tools, Templates & Agents",
    description:
      "Compare 2,400+ AI tools, developer templates, and agents. Community-ranked with real votes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://stackover.dev",
  },
};
```

**Step 2: Update the header brand name**

In `components/header.tsx`, change `StackAtlas` to `stackover.dev`.

**Step 3: Verify the dev server runs**

Run: `npm run dev`
Expected: No errors, page loads with new title in browser tab.

**Step 4: Commit**

```bash
git add app/layout.tsx components/header.tsx
git commit -m "feat(seo): update brand to stackover.dev, add metadataBase and global OG metadata"
```

---

### Task 2: Add robots.ts

**Files:**
- Create: `app/robots.ts`

**Step 1: Create the robots.ts file**

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/"],
      },
    ],
    sitemap: "https://stackover.dev/sitemap.xml",
  };
}
```

**Step 2: Verify**

Run: `curl http://localhost:3000/robots.txt`
Expected: Proper robots.txt content with sitemap reference.

**Step 3: Commit**

```bash
git add app/robots.ts
git commit -m "feat(seo): add robots.ts with sitemap reference"
```

---

### Task 3: Add Dynamic Sitemap

**Files:**
- Create: `app/sitemap.ts`
- Create: `convex/seo.ts` (new Convex query to get all tool slugs)

**Step 1: Create a Convex query that returns all tool slugs**

Create `convex/seo.ts`:

```typescript
import { query } from "./_generated/server";

export const allToolSlugs = query({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();
    return tools.map((t) => ({
      slug: t.slug,
      name: t.name,
      primaryCategory: t.primaryCategory,
    }));
  },
});

export const allCategories = query({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();
    const categories = new Set<string>();
    for (const tool of tools) {
      if (tool.primaryCategory) {
        categories.add(tool.primaryCategory);
      }
    }
    return Array.from(categories);
  },
});
```

**Step 2: Create the sitemap**

Create `app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://stackover.dev";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Dynamic tool pages
  try {
    const tools = await fetchQuery(api.seo.allToolSlugs);
    const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categories = await fetchQuery(api.seo.allCategories);
    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    return [...staticPages, ...categoryPages, ...toolPages];
  } catch {
    // Fallback if Convex is unavailable during build
    return staticPages;
  }
}
```

**Step 3: Verify**

Run: `curl http://localhost:3000/sitemap.xml`
Expected: XML sitemap listing all tool URLs.

Note: `npx convex dev` must be running for the Convex queries to work.

**Step 4: Commit**

```bash
git add convex/seo.ts app/sitemap.ts
git commit -m "feat(seo): add dynamic sitemap.xml with all tool and category URLs"
```

---

### Task 4: Refactor Tool Profile Page — Server Component + generateMetadata

This is the most critical task. The tool page is currently a single client component. We need to split it into:
1. A **server component** page that fetches tool data, generates metadata, injects JSON-LD
2. A **client component** that receives preloaded data and renders the reactive UI

**Files:**
- Modify: `app/tools/[slug]/page.tsx` (convert to server component)
- Create: `app/tools/[slug]/tool-profile-content.tsx` (extract client component)

**Step 1: Extract the client component**

Create `app/tools/[slug]/tool-profile-content.tsx` with the existing UI code, accepting preloaded data via `usePreloadedQuery`.

**Step 2: Rewrite the page.tsx as a server component**

The new `app/tools/[slug]/page.tsx` should:
- Export `generateMetadata()` that uses `fetchQuery(api.tools.bySlug, { slug })` to generate dynamic title, description, OG, Twitter, canonical
- Use `preloadQuery()` to pass data to the client component
- Inject 3 JSON-LD blocks: `SoftwareApplication`, `BreadcrumbList`, `FAQPage`
- Call `notFound()` from `next/navigation` if tool doesn't exist

Meta title pattern: `{Tool Name} — Reviews, Pricing & Alternatives`
Meta description pattern: `{description} See ratings, pros & cons, and top alternatives on stackover.dev.`

JSON-LD blocks:
- **SoftwareApplication**: name, description, url, applicationCategory, operatingSystem, aggregateRating (from baselineScore)
- **BreadcrumbList**: Home > Tools > {Tool Name}
- **FAQPage**: "What is {name}?", "What are the pros of {name}?", "What are the cons of {name}?"

**Step 3: Verify**

Run: `npm run dev` (with `npx convex dev` running)
Navigate to any tool page. View source — confirm `<title>` has tool name, JSON-LD scripts present.

**Step 4: Commit**

```bash
git add app/tools/[slug]/page.tsx app/tools/[slug]/tool-profile-content.tsx
git commit -m "feat(seo): refactor tool page to server component with generateMetadata and JSON-LD"
```

---

### Task 5: Add not-found.tsx and error.tsx

**Files:**
- Create: `app/not-found.tsx`
- Create: `app/tools/[slug]/not-found.tsx`
- Create: `app/error.tsx`

**Step 1: Create global not-found page**

Simple centered layout with 404 heading and link back to explorer.

**Step 2: Create tool-specific not-found page**

Similar but with messaging about the tool not existing in the directory.

**Step 3: Create error boundary**

Client component (`"use client"`) with reset button.

**Step 4: Commit**

```bash
git add app/not-found.tsx app/tools/[slug]/not-found.tsx app/error.tsx
git commit -m "feat(seo): add 404 not-found pages and error boundary"
```

---

### Task 6: Add Homepage JSON-LD (WebSite + SearchAction + Organization)

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add structured data to the homepage**

Add two JSON-LD blocks:
- **WebSite** with `SearchAction` (enables Google sitelinks searchbox): target URL template `https://stackover.dev/?q={search_term_string}`
- **Organization**: name, url, logo

**Step 2: Verify**

View page source at `http://localhost:3000/` — confirm JSON-LD scripts.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(seo): add WebSite and Organization JSON-LD to homepage"
```

---

### Task 7: Add GitHub Remote + Verify Build

**Step 1: Add the GitHub remote**

```bash
git remote add origin https://github.com/marcusbey/stackover_dev.git
```

**Step 2: Run lint**

Run: `npm run lint`
Expected: No errors.

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Push to GitHub**

```bash
git push -u origin main
```

---

## Summary of Changes

| File | Action | Purpose |
|------|--------|---------|
| `app/layout.tsx` | Modify | metadataBase, brand, OG/Twitter defaults, keywords |
| `components/header.tsx` | Modify | Brand rename StackAtlas -> stackover.dev |
| `app/robots.ts` | Create | Robots.txt with crawl rules + sitemap ref |
| `app/sitemap.ts` | Create | Dynamic XML sitemap from Convex data |
| `convex/seo.ts` | Create | Server queries for sitemap generation |
| `app/tools/[slug]/page.tsx` | Rewrite | Server component with generateMetadata + JSON-LD |
| `app/tools/[slug]/tool-profile-content.tsx` | Create | Extracted client component for tool UI |
| `app/tools/[slug]/not-found.tsx` | Create | SEO-friendly tool 404 page |
| `app/not-found.tsx` | Create | Global 404 page |
| `app/error.tsx` | Create | Error boundary |
| `app/page.tsx` | Modify | WebSite + Organization JSON-LD |
