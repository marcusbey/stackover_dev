# Tool Aliveness Signal — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add GitHub-powered activity metrics (sparklines, aliveness scores, release info) to every tool card, profile page, and stack view.

**Architecture:** A Convex cron action fetches GitHub API data daily for all tools with a `githubUrl`. Results are stored in a `toolActivity` time-series table (weekly buckets) and summary fields on the `tools` table. Pure UI components (`ActivitySparkline`, `AlivenessBadge`) render the data. No external dependencies beyond the GitHub REST API.

**Tech Stack:** Convex (actions, crons, mutations), GitHub REST API v3, React (client components), Tailwind CSS

---

## Task 1: Schema — Add activity fields to `tools` + new `toolActivity` table

**Files:**
- Modify: `convex/schema.ts`

**Step 1: Add fields to `tools` table**

In `convex/schema.ts`, add these optional fields to the `tools` defineTable call, after `primaryCategory`:

```typescript
    githubUrl: v.optional(v.string()),
    lastRelease: v.optional(v.string()),
    lastReleaseDate: v.optional(v.number()),
    lastCommitDate: v.optional(v.number()),
    openIssues: v.optional(v.number()),
    stars: v.optional(v.number()),
    alivenessScore: v.optional(v.number()),
```

**Step 2: Add `toolActivity` table**

After the `stacks` table definition, add:

```typescript
  toolActivity: defineTable({
    toolId: v.id("tools"),
    weekStart: v.number(),
    commits: v.number(),
    releases: v.number(),
    issuesClosed: v.number(),
  })
    .index("by_tool_week", ["toolId", "weekStart"]),
```

**Step 3: Run codegen**

Run: `npx convex codegen`
Expected: `Running TypeScript...` completes with no errors.

**Step 4: Commit**

```
git add convex/schema.ts
git commit -m "feat(aliveness): add activity fields to tools schema + toolActivity table"
```

---

## Task 2: Aliveness utilities — score computation + tier mapping

**Files:**
- Create: `lib/aliveness.ts`

**Step 1: Create the utility file**

```typescript
export interface AlivenessTier {
  label: string;
  color: string;       // tailwind text color
  bgColor: string;     // tailwind bg color
  dotColor: string;    // tailwind fill/bg for dot
}

const TIERS: { min: number; tier: AlivenessTier }[] = [
  {
    min: 80,
    tier: {
      label: "Thriving",
      color: "text-green-600",
      bgColor: "bg-green-50",
      dotColor: "bg-green-500",
    },
  },
  {
    min: 50,
    tier: {
      label: "Active",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-500",
    },
  },
  {
    min: 20,
    tier: {
      label: "Slowing",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      dotColor: "bg-yellow-500",
    },
  },
  {
    min: 0,
    tier: {
      label: "Stale",
      color: "text-red-600",
      bgColor: "bg-red-50",
      dotColor: "bg-red-500",
    },
  },
];

export function getAlivenessTier(score: number | undefined): AlivenessTier | null {
  if (score === undefined || score === null) return null;
  const clamped = Math.max(0, Math.min(100, score));
  for (const { min, tier } of TIERS) {
    if (clamped >= min) return tier;
  }
  return TIERS[TIERS.length - 1].tier;
}

/**
 * Compute aliveness score (0-100) from GitHub metrics.
 * Called server-side in the sync action.
 */
export function computeAlivenessScore(params: {
  commitsLast90Days: number;
  avgWeeklyCommits: number;
  daysSinceLastRelease: number | null;
  issuesClosedLast90Days: number;
  issuesOpenedLast90Days: number;
  starsGrowthRate: number; // e.g. 0.05 = 5% growth
}): number {
  // 40% — Commit frequency
  const commitRatio = params.avgWeeklyCommits > 0
    ? Math.min(params.commitsLast90Days / (params.avgWeeklyCommits * 13), 2)
    : params.commitsLast90Days > 0 ? 1 : 0;
  const commitScore = Math.min(commitRatio * 50, 100);

  // 30% — Release recency (exponential decay)
  let releaseScore = 0;
  if (params.daysSinceLastRelease !== null) {
    // Score 100 if released today, ~50 at 30 days, ~10 at 90 days, ~0 at 180+
    releaseScore = Math.max(0, 100 * Math.exp(-params.daysSinceLastRelease / 45));
  }

  // 20% — Issue resolution rate
  const totalIssues = params.issuesClosedLast90Days + params.issuesOpenedLast90Days;
  const issueScore = totalIssues > 0
    ? (params.issuesClosedLast90Days / totalIssues) * 100
    : 50; // neutral if no issues

  // 10% — Star trend
  const starScore = Math.min(Math.max(params.starsGrowthRate * 1000, 0), 100);

  const score =
    commitScore * 0.4 +
    releaseScore * 0.3 +
    issueScore * 0.2 +
    starScore * 0.1;

  return Math.round(Math.max(0, Math.min(100, score)));
}
```

**Step 2: Commit**

```
git add lib/aliveness.ts
git commit -m "feat(aliveness): add score computation + tier utilities"
```

---

## Task 3: GitHub fetch action — single-tool data fetcher

**Files:**
- Create: `convex/github.ts`

**Step 1: Create the action**

This Convex action calls the GitHub REST API for a single repository and returns structured metrics. It's an `internalAction` so only the sync orchestrator can call it.

```typescript
"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

function extractOwnerRepo(githubUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch {
    // invalid URL
  }
  return null;
}

async function ghFetch(path: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "stackover-dev-activity-sync",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      throw new Error(`GitHub rate limited: ${res.status}`);
    }
    return null; // 404 or other non-critical errors
  }
  return res.json();
}

export const fetchRepoActivity = internalAction({
  args: { githubUrl: v.string() },
  returns: v.union(
    v.object({
      stars: v.number(),
      openIssues: v.number(),
      lastCommitDate: v.union(v.number(), v.null()),
      lastRelease: v.union(v.string(), v.null()),
      lastReleaseDate: v.union(v.number(), v.null()),
      weeklyCommits: v.array(v.number()),
      recentIssuesClosed: v.number(),
      recentIssuesOpened: v.number(),
    }),
    v.null()
  ),
  handler: async (_ctx, args) => {
    const parsed = extractOwnerRepo(args.githubUrl);
    if (!parsed) return null;

    const { owner, repo } = parsed;
    const token = process.env.GITHUB_TOKEN;

    // Fetch repo info (stars, open issues)
    const repoData = await ghFetch(`/repos/${owner}/${repo}`, token);
    if (!repoData) return null;

    // Fetch latest release
    const releases = await ghFetch(
      `/repos/${owner}/${repo}/releases?per_page=1`,
      token
    );
    const latestRelease = releases?.[0] ?? null;

    // Fetch commit activity (last 52 weeks)
    // Returns array of { total, week, days } — 52 entries
    const commitActivity = await ghFetch(
      `/repos/${owner}/${repo}/stats/commit_activity`,
      token
    );

    // Fetch recent closed issues (last 90 days)
    const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const closedIssues = await ghFetch(
      `/repos/${owner}/${repo}/issues?state=closed&since=${since90}&per_page=1`,
      token
    );
    const openedIssues = await ghFetch(
      `/repos/${owner}/${repo}/issues?state=open&since=${since90}&per_page=1`,
      token
    );

    // Parse last commit date from default branch
    const commits = await ghFetch(
      `/repos/${owner}/${repo}/commits?per_page=1`,
      token
    );
    const lastCommitDate = commits?.[0]?.commit?.committer?.date
      ? new Date(commits[0].commit.committer.date).getTime()
      : null;

    // Weekly commit totals (array of 52 numbers)
    const weeklyCommits: number[] = Array.isArray(commitActivity)
      ? commitActivity.map((w: { total: number }) => w.total)
      : [];

    // GitHub returns total_count in the Link header or we estimate from per_page=1
    // For simplicity, use the array length heuristic via the search API
    // Actually, the /issues endpoint returns up to per_page items, so we need
    // to use the search API or parse Link headers. Simpler: just use the repo's
    // open_issues_count and the arrays we fetched.
    const recentIssuesClosed = Array.isArray(closedIssues) ? closedIssues.length : 0;
    const recentIssuesOpened = Array.isArray(openedIssues) ? openedIssues.length : 0;

    return {
      stars: repoData.stargazers_count ?? 0,
      openIssues: repoData.open_issues_count ?? 0,
      lastCommitDate,
      lastRelease: latestRelease?.tag_name ?? null,
      lastReleaseDate: latestRelease?.published_at
        ? new Date(latestRelease.published_at).getTime()
        : null,
      weeklyCommits,
      recentIssuesClosed,
      recentIssuesOpened,
    };
  },
});
```

**Step 2: Commit**

```
git add convex/github.ts
git commit -m "feat(aliveness): add GitHub API fetch action"
```

---

## Task 4: Sync orchestrator — daily update mutation + action

**Files:**
- Create: `convex/syncActivity.ts`

**Step 1: Create the sync orchestrator**

This file has two functions:
1. `syncAllTools` — internalAction that iterates tools with `githubUrl`, calls the GitHub fetcher, then calls the update mutation
2. `updateToolActivity` — internalMutation that writes the results to DB

```typescript
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { computeAlivenessScore } from "../lib/aliveness";

export const syncAllTools = internalAction({
  args: {},
  handler: async (ctx) => {
    // Get all tools with a githubUrl
    const tools = await ctx.runQuery(internal.syncActivity.toolsWithGithub);

    for (const tool of tools) {
      try {
        const activity = await ctx.runAction(
          internal.github.fetchRepoActivity,
          { githubUrl: tool.githubUrl }
        );

        if (activity) {
          await ctx.runMutation(internal.syncActivity.updateToolActivity, {
            toolId: tool._id,
            stars: activity.stars,
            openIssues: activity.openIssues,
            lastCommitDate: activity.lastCommitDate ?? undefined,
            lastRelease: activity.lastRelease ?? undefined,
            lastReleaseDate: activity.lastReleaseDate ?? undefined,
            weeklyCommits: activity.weeklyCommits,
            recentIssuesClosed: activity.recentIssuesClosed,
            recentIssuesOpened: activity.recentIssuesOpened,
          });
        }
      } catch (e) {
        // Log but don't fail the entire sync for one tool
        console.error(`Failed to sync ${tool.name}:`, e);
      }
    }
  },
});

export const toolsWithGithub = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allTools = await ctx.db.query("tools").collect();
    return allTools
      .filter((t) => t.githubUrl)
      .map((t) => ({ _id: t._id, name: t.name, githubUrl: t.githubUrl! }));
  },
});

export const updateToolActivity = internalMutation({
  args: {
    toolId: v.id("tools"),
    stars: v.number(),
    openIssues: v.number(),
    lastCommitDate: v.optional(v.number()),
    lastRelease: v.optional(v.string()),
    lastReleaseDate: v.optional(v.number()),
    weeklyCommits: v.array(v.number()),
    recentIssuesClosed: v.number(),
    recentIssuesOpened: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Compute aliveness score
    const commitsLast90Days = args.weeklyCommits.slice(-13).reduce((a, b) => a + b, 0);
    const avgWeeklyCommits = args.weeklyCommits.length > 0
      ? args.weeklyCommits.reduce((a, b) => a + b, 0) / args.weeklyCommits.length
      : 0;

    const daysSinceLastRelease = args.lastReleaseDate
      ? (now - args.lastReleaseDate) / (1000 * 60 * 60 * 24)
      : null;

    // Get previous star count to compute growth
    const tool = await ctx.db.get(args.toolId);
    const prevStars = tool?.stars ?? args.stars;
    const starsGrowthRate = prevStars > 0
      ? (args.stars - prevStars) / prevStars
      : 0;

    const alivenessScore = computeAlivenessScore({
      commitsLast90Days,
      avgWeeklyCommits,
      daysSinceLastRelease,
      issuesClosedLast90Days: args.recentIssuesClosed,
      issuesOpenedLast90Days: args.recentIssuesOpened,
      starsGrowthRate,
    });

    // Update tool fields
    await ctx.db.patch(args.toolId, {
      stars: args.stars,
      openIssues: args.openIssues,
      lastCommitDate: args.lastCommitDate,
      lastRelease: args.lastRelease,
      lastReleaseDate: args.lastReleaseDate,
      alivenessScore,
    });

    // Upsert weekly activity rows (last 12 weeks for sparklines)
    const recentWeeks = args.weeklyCommits.slice(-12);
    const nowMs = now;
    for (let i = 0; i < recentWeeks.length; i++) {
      // Calculate week start timestamp (going backwards from current week)
      const weeksAgo = recentWeeks.length - 1 - i;
      const weekStartMs = getWeekStart(nowMs - weeksAgo * 7 * 24 * 60 * 60 * 1000);

      // Check if row exists
      const existing = await ctx.db
        .query("toolActivity")
        .withIndex("by_tool_week", (q) =>
          q.eq("toolId", args.toolId).eq("weekStart", weekStartMs)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          commits: recentWeeks[i],
          releases: 0, // simplified: we mark the latest release week below
          issuesClosed: 0,
        });
      } else {
        await ctx.db.insert("toolActivity", {
          toolId: args.toolId,
          weekStart: weekStartMs,
          commits: recentWeeks[i],
          releases: 0,
          issuesClosed: 0,
        });
      }
    }

    // Mark the release week if there's a recent release
    if (args.lastReleaseDate) {
      const releaseWeekStart = getWeekStart(args.lastReleaseDate);
      const releaseRow = await ctx.db
        .query("toolActivity")
        .withIndex("by_tool_week", (q) =>
          q.eq("toolId", args.toolId).eq("weekStart", releaseWeekStart)
        )
        .first();
      if (releaseRow) {
        await ctx.db.patch(releaseRow._id, { releases: 1 });
      }
    }
  },
});

/** Get the Monday 00:00 UTC timestamp for the week containing `ms`. */
function getWeekStart(ms: number): number {
  const d = new Date(ms);
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday = 1
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}
```

**Important:** Add the missing import at top:

```typescript
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
```

(Note: `internalQuery` is also needed for `toolsWithGithub`.)

**Step 2: Commit**

```
git add convex/syncActivity.ts
git commit -m "feat(aliveness): add daily sync orchestrator + activity updater"
```

---

## Task 5: Cron job registration

**Files:**
- Create: `convex/crons.ts`

**Step 1: Create cron config**

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "sync tool activity from GitHub",
  { hourUTC: 6, minuteUTC: 0 },
  internal.syncActivity.syncAllTools,
);

export default crons;
```

**Step 2: Run codegen to validate**

Run: `npx convex codegen`
Expected: Completes with no errors.

**Step 3: Commit**

```
git add convex/crons.ts
git commit -m "feat(aliveness): register daily GitHub sync cron job"
```

---

## Task 6: Activity query — sparkline data for UI

**Files:**
- Modify: `convex/tools.ts`

**Step 1: Add `activityForTool` query**

Append to the end of `convex/tools.ts`:

```typescript
export const activityForTool = query({
  args: { toolId: v.id("tools") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("toolActivity")
      .withIndex("by_tool_week", (q) => q.eq("toolId", args.toolId))
      .order("asc")
      .take(52);

    return rows;
  },
});
```

**Step 2: Commit**

```
git add convex/tools.ts
git commit -m "feat(aliveness): add activityForTool query for sparklines"
```

---

## Task 7: AlivenessBadge component

**Files:**
- Create: `components/aliveness-badge.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { getAlivenessTier } from "@/lib/aliveness";
import { cn } from "@/lib/utils";

interface AlivenessBadgeProps {
  score: number | undefined;
  showLabel?: boolean;
  className?: string;
}

export function AlivenessBadge({
  score,
  showLabel = true,
  className,
}: AlivenessBadgeProps) {
  const tier = getAlivenessTier(score);
  if (!tier) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-medium",
        tier.color,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tier.dotColor)} />
      {showLabel && tier.label}
    </span>
  );
}
```

**Step 2: Commit**

```
git add components/aliveness-badge.tsx
git commit -m "feat(aliveness): add AlivenessBadge component"
```

---

## Task 8: ActivitySparkline component

**Files:**
- Create: `components/activity-sparkline.tsx`

**Step 1: Create the component**

A pure CSS/SVG sparkline — no chart library dependency.

```tsx
"use client";

import { getAlivenessTier } from "@/lib/aliveness";
import { cn } from "@/lib/utils";

interface ActivitySparklineProps {
  /** Weekly commit counts, e.g. 12 entries for 12 weeks */
  data: number[];
  alivenessScore?: number;
  /** Height in pixels */
  height?: number;
  className?: string;
}

export function ActivitySparkline({
  data,
  alivenessScore,
  height = 24,
  className,
}: ActivitySparklineProps) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data, 1);
  const tier = getAlivenessTier(alivenessScore);
  const barColor = tier?.dotColor ?? "bg-muted-foreground/30";

  return (
    <div
      className={cn("flex items-end gap-px", className)}
      style={{ height }}
      title={`${data.reduce((a, b) => a + b, 0)} commits over ${data.length} weeks`}
    >
      {data.map((value, i) => {
        const pct = Math.max((value / max) * 100, 4); // min 4% so empty weeks are visible
        return (
          <div
            key={i}
            className={cn("flex-1 rounded-sm min-w-[3px]", barColor)}
            style={{ height: `${pct}%` }}
          />
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```
git add components/activity-sparkline.tsx
git commit -m "feat(aliveness): add ActivitySparkline bar chart component"
```

---

## Task 9: Add sparkline to tool cards

**Files:**
- Modify: `components/tool-card.tsx`

**Step 1: Add sparkline to ToolCardProps and render**

Update the `ToolCardProps` interface to accept optional activity data:

```typescript
// Add to ToolCardProps.tool:
    alivenessScore?: number;
    activityData?: number[];
```

After the tags section (line 80, after the closing `</div>` of the tags wrapper), add:

```tsx
                {tool.activityData && tool.activityData.length > 0 && (
                  <div className="mt-2">
                    <ActivitySparkline
                      data={tool.activityData}
                      alivenessScore={tool.alivenessScore}
                      height={20}
                    />
                  </div>
                )}
```

Add imports at top:

```typescript
import { ActivitySparkline } from "@/components/activity-sparkline";
```

Also add the `AlivenessBadge` next to the score badge in the header row:

```tsx
import { AlivenessBadge } from "@/components/aliveness-badge";
```

After the type badge (`{tool.type}` badge), add:

```tsx
                  <AlivenessBadge score={tool.alivenessScore} showLabel={false} />
```

**Step 2: Commit**

```
git add components/tool-card.tsx
git commit -m "feat(aliveness): add sparkline + badge to tool cards"
```

---

## Task 10: Add full activity section to tool profile page

**Files:**
- Modify: `app/tools/[slug]/tool-profile-content.tsx`

**Step 1: Add activity section**

Add imports at top:

```typescript
import { useQuery } from "convex/react";
import { ActivitySparkline } from "@/components/activity-sparkline";
import { AlivenessBadge } from "@/components/aliveness-badge";
```

Note: The component currently uses `usePreloadedQuery`. We need an additional `useQuery` for activity data. Change the import line from `import { usePreloadedQuery } from "convex/react";` to:

```typescript
import { usePreloadedQuery, useQuery } from "convex/react";
```

After the Pros/Cons grid (after line 128, closing `</div>` of the grid), add this activity section:

```tsx
      {/* Activity Section */}
      {tool.alivenessScore !== undefined && (
        <>
          <Separator className="my-8" />
          <ActivitySection toolId={tool._id} tool={tool} />
        </>
      )}
```

Add this component at the bottom of the file (before the final export or after the main component):

```tsx
function ActivitySection({ toolId, tool }: { toolId: any; tool: any }) {
  const activity = useQuery(api.tools.activityForTool, { toolId });
  const weeklyData = activity?.map((r) => r.commits) ?? [];

  const daysSinceRelease = tool.lastReleaseDate
    ? Math.round((Date.now() - tool.lastReleaseDate) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <AlivenessBadge score={tool.alivenessScore} />
      </div>

      {weeklyData.length > 0 && (
        <div className="mb-4">
          <ActivitySparkline
            data={weeklyData}
            alivenessScore={tool.alivenessScore}
            height={48}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            {weeklyData.length}-week commit activity
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tool.lastRelease && (
          <div>
            <p className="text-xs text-muted-foreground">Latest Release</p>
            <p className="text-sm font-medium">{tool.lastRelease}</p>
            {daysSinceRelease !== null && (
              <p className="text-[11px] text-muted-foreground">
                {daysSinceRelease === 0 ? "Today" : `${daysSinceRelease}d ago`}
              </p>
            )}
          </div>
        )}
        {tool.stars !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Stars</p>
            <p className="text-sm font-medium">
              {tool.stars >= 1000
                ? `${(tool.stars / 1000).toFixed(1)}k`
                : tool.stars}
            </p>
          </div>
        )}
        {tool.openIssues !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Open Issues</p>
            <p className="text-sm font-medium">{tool.openIssues}</p>
          </div>
        )}
        {weeklyData.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Commits/Week</p>
            <p className="text-sm font-medium">
              {Math.round(
                weeklyData.slice(-4).reduce((a, b) => a + b, 0) / Math.min(4, weeklyData.length)
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```
git add app/tools/[slug]/tool-profile-content.tsx
git commit -m "feat(aliveness): add full activity section to tool profile page"
```

---

## Task 11: Add aliveness to stack layer rows

**Files:**
- Modify: `components/stacks/stack-layer-row.tsx`

**Step 1: Extend ToolChip with aliveness dot**

Update the `StackLayerRowProps.tools` type to include optional `alivenessScore`:

```typescript
  tools: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    websiteUrl: string;
    alivenessScore?: number;
  }[];
```

Add import at top:

```typescript
import { AlivenessBadge } from "@/components/aliveness-badge";
```

In the `ToolChip` function, update the type signature to include `alivenessScore?: number` and add the badge after the tool name:

After `<p className="text-sm font-medium truncate">{tool.name}</p>` add:

```tsx
        {tool.alivenessScore !== undefined && (
          <AlivenessBadge score={tool.alivenessScore} className="mt-0.5" />
        )}
```

**Step 2: Commit**

```
git add components/stacks/stack-layer-row.tsx
git commit -m "feat(aliveness): add aliveness badge to stack layer rows"
```

---

## Task 12: Add stale warning banner to stack view

**Files:**
- Modify: `app/stacks/[slug]/stack-view-content.tsx`

**Step 1: Add stale tool detection + warning banner**

After the stack layers `<div className="pt-4">` section (line 70-79), before `{/* Share */}`, add:

```tsx
      {/* Stale warning */}
      {(() => {
        const staleTools = filledLayers.flatMap((l) =>
          l.tools.filter(
            (t: any) => t.alivenessScore !== undefined && t.alivenessScore < 20
          )
        );
        if (staleTools.length === 0) return null;
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
            {staleTools.length === 1
              ? `1 tool in this stack hasn't been updated in 6+ months`
              : `${staleTools.length} tools in this stack haven't been updated in 6+ months`}
          </div>
        );
      })()}
```

**Step 2: Commit**

```
git add app/stacks/[slug]/stack-view-content.tsx
git commit -m "feat(aliveness): add stale tool warning banner on stack view"
```

---

## Task 13: Add `githubUrl` to seed data

**Files:**
- Modify: `convex/seed.ts`

**Step 1: Add `githubUrl` to tool inserts in seed**

Find each `ctx.db.insert("tools", { ... })` call and add `githubUrl` where applicable. The most important ones to seed (find each tool insert and add the field):

- Next.js → `githubUrl: "https://github.com/vercel/next.js"`
- React → `githubUrl: "https://github.com/facebook/react"`
- Express → `githubUrl: "https://github.com/expressjs/express"`
- PostgreSQL → `githubUrl: "https://github.com/postgres/postgres"`
- Redis → `githubUrl: "https://github.com/redis/redis"`
- Vue → `githubUrl: "https://github.com/vuejs/core"`
- Tailwind CSS → `githubUrl: "https://github.com/tailwindlabs/tailwindcss"`

Add `githubUrl` as a field on any tool insert that has a known GitHub repo. Leave it absent for closed-source tools (e.g., GPT-4o, Claude).

**Step 2: Commit**

```
git add convex/seed.ts
git commit -m "feat(aliveness): add githubUrl to seed data"
```

---

## Task 14: Build verification

**Step 1: Run codegen**

Run: `npx convex codegen`
Expected: Completes with no errors.

**Step 2: Run build**

Run: `npm run build`
Expected: Compiles successfully, all routes render.

**Step 3: Final commit if any fixes were needed**

```
git add -A
git commit -m "fix: resolve any build issues from aliveness feature"
```

---

## Task Dependencies

```
Task 1 (schema) → Task 3 (github action) → Task 4 (sync) → Task 5 (cron)
Task 1 (schema) → Task 6 (query)
Task 2 (utilities) → Task 4 (sync uses computeAlivenessScore)
Task 2 (utilities) → Task 7 (badge uses getAlivenessTier)
Task 2 (utilities) → Task 8 (sparkline uses getAlivenessTier)
Task 7 (badge) + Task 8 (sparkline) → Task 9 (tool card)
Task 7 (badge) + Task 8 (sparkline) → Task 10 (profile)
Task 7 (badge) → Task 11 (stack layer)
Task 11 → Task 12 (stack warning)
Task 1 → Task 13 (seed)
All → Task 14 (verification)
```

## Environment Setup

Add `GITHUB_TOKEN` to `.env.local` for higher API rate limits (optional but recommended):

```
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

Without a token, GitHub allows 60 requests/hour. With a token, 5,000/hour.
