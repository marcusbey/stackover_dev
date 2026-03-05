# SEO Phase 2: Programmatic Pages for stackover.dev

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create ~3,000 new rankable pages — category landing pages, alternatives pages, and comparison pages — all server-rendered with full SEO metadata and JSON-LD structured data.

**Architecture:** Each page type follows the Phase 1 pattern: server component (generateMetadata + JSON-LD) wrapping a client component (preloaded Convex data for reactivity). New Convex queries provide the data. The existing `SEARCH_CATEGORIES` in `lib/search-constants.ts` provides category slug-to-label mapping. Sitemap is extended to include all new URLs.

**Tech Stack:** Next.js 16 App Router, Convex (`fetchQuery` / `preloadQuery`), TypeScript, JSON-LD, `lib/search-constants.ts` for category metadata

**Note on JSON-LD:** All JSON-LD blocks use `JSON.stringify()` on data from our Convex database (trusted source). `JSON.stringify` escapes HTML entities, making this safe. This is the [recommended Next.js pattern](https://nextjs.org/docs/app/guides/json-ld).

---

### Task 1: Add New Convex Queries for Phase 2

**Files:**
- Modify: `convex/tools.ts` (add `alternatives` and `byTwoSlugs` queries)
- Modify: `convex/seo.ts` (add `comparisonPairs` query)

**Step 1: Add `alternatives` query to `convex/tools.ts`**

Add after the existing `byTag` query at the bottom:

```typescript
export const alternatives = query({
  args: {
    slug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const take = args.limit ?? 20;
    const tool = await ctx.db
      .query("tools")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!tool || !tool.primaryCategory) return [];

    const sameCategoryTools = await ctx.db
      .query("tools")
      .withIndex("by_primary_category", (q) =>
        q.eq("primaryCategory", tool.primaryCategory!)
      )
      .take(take + 1);

    return sameCategoryTools
      .filter((t) => t.slug !== args.slug)
      .slice(0, take);
  },
});

export const byTwoSlugs = query({
  args: {
    slugA: v.string(),
    slugB: v.string(),
  },
  handler: async (ctx, args) => {
    const [toolA, toolB] = await Promise.all([
      ctx.db
        .query("tools")
        .withIndex("by_slug", (q) => q.eq("slug", args.slugA))
        .first(),
      ctx.db
        .query("tools")
        .withIndex("by_slug", (q) => q.eq("slug", args.slugB))
        .first(),
    ]);
    return { toolA, toolB };
  },
});
```

**Step 2: Add `comparisonPairs` query to `convex/seo.ts`**

Add after the existing `allCategories` query:

```typescript
export const comparisonPairs = query({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();

    // Group by category, take top 10 by baselineScore per category
    const byCategory: Record<string, { slug: string; baselineScore: number }[]> = {};
    for (const tool of tools) {
      const cat = tool.primaryCategory;
      if (!cat) continue;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push({ slug: tool.slug, baselineScore: tool.baselineScore });
    }

    const pairs: string[] = [];
    for (const categoryTools of Object.values(byCategory)) {
      const sorted = categoryTools.sort((a, b) => b.baselineScore - a.baselineScore).slice(0, 10);
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const [a, b] = [sorted[i].slug, sorted[j].slug].sort();
          pairs.push(`${a}-vs-${b}`);
        }
      }
    }

    return pairs;
  },
});
```

**Step 3: Commit**

```bash
git add convex/tools.ts convex/seo.ts
git commit -m "feat(seo): add alternatives, byTwoSlugs, and comparisonPairs Convex queries"
```

---

### Task 2: Create Category Meta Helper

**Files:**
- Create: `lib/category-meta.ts`

**Step 1: Create the category metadata helper**

This maps category slugs to SEO-friendly labels and descriptions. Reuses `SEARCH_CATEGORIES` from `lib/search-constants.ts`.

```typescript
import { SEARCH_CATEGORIES } from "./search-constants";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ai: "Discover the best AI and machine learning tools for developers. Compare LLMs, AI APIs, image generators, and more.",
  "dev-tools": "Find the best developer tools for coding, debugging, CI/CD, and productivity. Community-ranked by real developers.",
  databases: "Compare top databases and storage solutions. From PostgreSQL to Redis, find the right database for your project.",
  cloud: "Explore the best cloud infrastructure and hosting platforms. Compare AWS, Vercel, Railway, and more.",
  web: "Discover the best web development frameworks and tools. From Next.js to Astro, find what fits your stack.",
  mobile: "Find the best mobile development tools and frameworks. Compare React Native, Flutter, and more.",
  design: "Explore the best design and UI tools for developers. From Figma to Tailwind, find your perfect workflow.",
  video: "Compare video and media tools for streaming, editing, and processing.",
  nocode: "Discover the best no-code and low-code platforms. Build faster without writing code.",
  analytics: "Find the best analytics and data visualization tools. Track events, build dashboards, and understand your users.",
  marketing: "Compare marketing tools for campaigns, email, SEO, and growth.",
  sales: "Find the best sales and CRM tools. Manage pipelines, contacts, and close more deals.",
  support: "Explore customer support and helpdesk tools. From Intercom to Zendesk.",
  collaboration: "Compare project management and collaboration tools for teams.",
  auth: "Find the best authentication and security tools for your app.",
  payments: "Compare payment processing and billing tools. Stripe, Paddle, and more.",
  ecommerce: "Discover the best e-commerce platforms and tools for online stores.",
  communication: "Find the best email, messaging, and notification tools.",
  cms: "Compare content management systems and blogging platforms.",
  hr: "Explore HR, recruiting, and talent management tools.",
  education: "Find the best education and e-learning tools and platforms.",
  social: "Compare tools for building social features and communities.",
  automation: "Discover the best workflow automation and integration tools.",
  search: "Find the best search engines and full-text search solutions.",
  monitoring: "Compare monitoring, observability, and logging tools.",
};

export function getCategoryMeta(slug: string) {
  const category = SEARCH_CATEGORIES.find((c) => c.slug === slug);
  const label = category?.label ?? slug;
  const description =
    CATEGORY_DESCRIPTIONS[slug] ??
    `Compare the best ${label} tools. Community-ranked with real developer votes on stackover.dev.`;

  return { label, description, color: category?.color };
}

export function getAllCategorySlugs(): string[] {
  return SEARCH_CATEGORIES.map((c) => c.slug);
}
```

**Step 2: Commit**

```bash
git add lib/category-meta.ts
git commit -m "feat(seo): add category metadata helper with SEO descriptions"
```

---

### Task 3: Create Category Landing Pages

**Files:**
- Create: `app/categories/[slug]/page.tsx` (server component with generateMetadata, generateStaticParams, ItemList + BreadcrumbList JSON-LD)
- Create: `app/categories/[slug]/category-content.tsx` (client component with tool grid using ToolCard)

Server component uses `getCategoryMeta()` for labels, `fetchQuery(api.tools.byCategory)` for data, `preloadQuery` for client hydration. Title pattern: `Best {Label} Tools in 2026`. Category pages get `generateStaticParams()` from `getAllCategorySlugs()`.

**Commit:** `feat(seo): add category landing pages with ItemList JSON-LD`

---

### Task 4: Create Alternatives Pages

**Files:**
- Create: `app/tools/[slug]/alternatives/page.tsx` (server component with generateMetadata, ItemList + BreadcrumbList JSON-LD)
- Create: `app/tools/[slug]/alternatives/alternatives-content.tsx` (client component showing tool header + grid of alternatives)

Server component uses `fetchQuery(api.tools.bySlug)` for the main tool, `fetchQuery(api.tools.alternatives)` for alternatives. Title: `Best {Tool} Alternatives in 2026`. Client component shows tool info header with score badge, then grid of alternatives using ToolCard.

**Commit:** `feat(seo): add tool alternatives pages with ItemList JSON-LD`

---

### Task 5: Create Comparison Pages

**Files:**
- Create: `app/compare/[pair]/page.tsx` (server component — parse `{slugA}-vs-{slugB}` from param, generateMetadata, FAQPage + BreadcrumbList JSON-LD)
- Create: `app/compare/[pair]/comparison-content.tsx` (client component — side-by-side tool columns with pros/cons/score, "Higher rated" badge on winner)

Server component uses `parsePair()` helper to extract slugs from URL param, `fetchQuery(api.tools.byTwoSlugs)` for data. Title: `{A} vs {B} — Which Is Better?`. FAQ JSON-LD with "Is A better than B?" and "What is the difference?" questions. Client shows two-column layout with ToolColumn sub-component.

**Commit:** `feat(seo): add comparison pages with side-by-side layout and FAQ JSON-LD`

---

### Task 6: Update Sitemap with All New Page Types

**Files:**
- Modify: `app/sitemap.ts`

Add alternatives pages (`/tools/{slug}/alternatives` for each tool, priority 0.7), comparison pages (`/compare/{pair}` for each pair, priority 0.6). Fetch new `api.seo.comparisonPairs` query.

**Commit:** `feat(seo): update sitemap with alternatives and comparison URLs`

---

### Task 7: Add Internal Cross-Links to Tool Profile Page

**Files:**
- Modify: `app/tools/[slug]/tool-profile-content.tsx`

Add an "Explore More" section at the bottom with links to `/tools/{slug}/alternatives` and `/categories/{primaryCategory}`. This creates the internal linking network between page types.

**Commit:** `feat(seo): add internal cross-links on tool profile pages`

---

### Task 8: Verify Build and Push

Run `npm run lint`, `npm run build`, verify new routes appear in build output, then `git push origin main`.

---

## Summary of Changes

| File | Action | Purpose |
|------|--------|---------|
| `convex/tools.ts` | Modify | Add `alternatives` and `byTwoSlugs` queries |
| `convex/seo.ts` | Modify | Add `comparisonPairs` query |
| `lib/category-meta.ts` | Create | Category slug to label/description mapping |
| `app/categories/[slug]/page.tsx` | Create | Category landing page (server component) |
| `app/categories/[slug]/category-content.tsx` | Create | Category page client component |
| `app/tools/[slug]/alternatives/page.tsx` | Create | Alternatives page (server component) |
| `app/tools/[slug]/alternatives/alternatives-content.tsx` | Create | Alternatives client component |
| `app/compare/[pair]/page.tsx` | Create | Comparison page (server component) |
| `app/compare/[pair]/comparison-content.tsx` | Create | Comparison client component |
| `app/sitemap.ts` | Modify | Add alternatives + comparison URLs |
| `app/tools/[slug]/tool-profile-content.tsx` | Modify | Add internal cross-links |
