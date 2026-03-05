import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { computeAlivenessScore } from "../lib/aliveness";

export const syncAllTools = internalAction({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.runQuery(internal.syncActivity.toolsWithGithub);

    for (const tool of tools) {
      try {
        const activity = await ctx.runAction(internal.github.fetchRepoActivity, {
          githubUrl: tool.githubUrl,
        });

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

    const commitsLast90Days = args.weeklyCommits.slice(-13).reduce((a, b) => a + b, 0);
    const avgWeeklyCommits = args.weeklyCommits.length > 0
      ? args.weeklyCommits.reduce((a, b) => a + b, 0) / args.weeklyCommits.length
      : 0;

    const daysSinceLastRelease = args.lastReleaseDate
      ? (now - args.lastReleaseDate) / (1000 * 60 * 60 * 24)
      : null;

    const tool = await ctx.db.get(args.toolId);
    const prevStars = tool?.stars ?? args.stars;
    const starsGrowthRate = prevStars > 0 ? (args.stars - prevStars) / prevStars : 0;

    const alivenessScore = computeAlivenessScore({
      commitsLast90Days,
      avgWeeklyCommits,
      daysSinceLastRelease,
      issuesClosedLast90Days: args.recentIssuesClosed,
      issuesOpenedLast90Days: args.recentIssuesOpened,
      starsGrowthRate,
    });

    await ctx.db.patch(args.toolId, {
      stars: args.stars,
      openIssues: args.openIssues,
      lastCommitDate: args.lastCommitDate,
      lastRelease: args.lastRelease,
      lastReleaseDate: args.lastReleaseDate,
      alivenessScore,
    });

    // Upsert weekly activity rows (last 12 weeks)
    const recentWeeks = args.weeklyCommits.slice(-12);
    for (let i = 0; i < recentWeeks.length; i++) {
      const weeksAgo = recentWeeks.length - 1 - i;
      const weekStartMs = getWeekStart(now - weeksAgo * 7 * 24 * 60 * 60 * 1000);

      const existing = await ctx.db
        .query("toolActivity")
        .withIndex("by_tool_week", (q) =>
          q.eq("toolId", args.toolId).eq("weekStart", weekStartMs)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          commits: recentWeeks[i],
          releases: 0,
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

function getWeekStart(ms: number): number {
  const d = new Date(ms);
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}
