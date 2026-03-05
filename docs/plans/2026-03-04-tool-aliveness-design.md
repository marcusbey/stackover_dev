# Tool Aliveness Signal — Design Document

**Date:** 2026-03-04
**Status:** Approved

## Problem

stackover.dev shows static scores and descriptions for tools. In a world of AI services and rapid shipping, users need to know: **Is this tool still alive? How actively is it being developed?** A tool with a high baseline score that hasn't shipped in a year is a risk.

## Goals

1. Show how actively each tool/service is shipping — commit frequency, release cadence, issue health
2. Surface aliveness per-layer on stack views so users spot risk in their stack
3. Make "shipping velocity" a first-class signal alongside the existing quality score

## Design

### Data Source: GitHub API

Each tool gets an optional `githubUrl` field. A scheduled Convex action fetches activity metrics from the GitHub REST API every 24 hours.

**Why GitHub**: Single richest source for open-source tool health. One API gives commit frequency, release dates, issue velocity, and star trends.

**Why scheduled sync (not on-demand)**: Sparklines should render instantly — no loading flicker. Tools are a finite set (hundreds), so API quota is fine. Stack views need all tools hydrated at once.

### Schema Changes

**`tools` table — add fields:**

| Field | Type | Description |
|-------|------|-------------|
| `githubUrl` | `optional(string)` | GitHub repo URL |
| `lastRelease` | `optional(string)` | Latest release tag (e.g. "v15.2.0") |
| `lastReleaseDate` | `optional(number)` | Timestamp of last release |
| `lastCommitDate` | `optional(number)` | Timestamp of last commit to default branch |
| `openIssues` | `optional(number)` | Current open issue count |
| `stars` | `optional(number)` | GitHub star count |
| `alivenessScore` | `optional(number)` | Computed 0-100 score |

**New `toolActivity` table (time-series for sparklines):**

```
toolActivity
  toolId        Id<"tools">
  weekStart     number          // timestamp, start of ISO week
  commits       number
  releases      number
  issuesClosed  number
  index: by_tool_week [toolId, weekStart]
```

### Aliveness Score Formula (0-100)

| Weight | Signal | How |
|--------|--------|-----|
| 40% | Commit frequency | Commits in last 90 days vs. historical weekly average |
| 30% | Release recency | Exponential decay from last release date |
| 20% | Issue resolution | Closed/opened ratio over last 90 days |
| 10% | Star trend | Growth rate over last 90 days |

### Aliveness Tiers

| Score | Label | Color | Meaning |
|-------|-------|-------|---------|
| 80-100 | Thriving | `green` | Shipping fast, active community |
| 50-79 | Active | `blue` | Regular updates, healthy maintenance |
| 20-49 | Slowing | `yellow` | Less frequent updates, watch this |
| 0-19 | Stale | `red` | Minimal activity, consider alternatives |

### Visual: Activity Sparkline

**Tool cards** — 12-week mini bar chart at the bottom of each card. Bar color matches aliveness tier. Shows at a glance whether a tool is shipping.

**Tool profile page** — Full 52-week activity chart with release markers (dots on the timeline). Breakdown section showing: last release + date, average commits/week, stars, open issues, issue resolution rate.

### Stack View: Per-Layer Breakdown

Each layer row in `/stacks/[slug]` gets a colored aliveness dot + tier label next to the tool name.

If any layer tool scores "Stale" (0-19), show a warning banner at the top of the stack:
> "⚠ 1 tool in this stack hasn't been updated in 6+ months"

### Data Pipeline

1. **`convex/github.ts`** — Convex action that calls GitHub REST API for a single tool
2. **`convex/syncActivity.ts`** — Scheduled cron (runs daily) that iterates all tools with `githubUrl`, calls the GitHub action, writes `toolActivity` rows and updates tool fields
3. **`convex/crons.ts`** — Registers the daily schedule
4. Aliveness score recomputed on each sync

### Handling Tools Without GitHub

Tools without a `githubUrl` get no sparkline and show "No activity data" in a muted style. Their aliveness score remains `undefined` — they're ranked by `baselineScore` only.

### Files

**New:**
- `convex/github.ts` — GitHub API fetch action
- `convex/syncActivity.ts` — Daily sync orchestrator
- `convex/crons.ts` — Cron schedule registration
- `components/activity-sparkline.tsx` — Sparkline bar chart component
- `components/aliveness-badge.tsx` — Colored dot + tier label

**Modified:**
- `convex/schema.ts` — Add fields to `tools`, add `toolActivity` table
- `components/tool-card.tsx` — Add sparkline below description
- `app/tools/[slug]/tool-profile-content.tsx` — Add full activity section
- `components/stacks/stack-layer-row.tsx` — Add aliveness dot per tool
- `app/stacks/[slug]/stack-view-content.tsx` — Add stale warning banner
- `convex/seed.ts` — Add `githubUrl` to seed data
