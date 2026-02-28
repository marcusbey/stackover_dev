import { query } from "./_generated/server";
import { v } from "convex/values";

export const byFilter = query({
  args: { filterNodeId: v.id("filterNodes") },
  handler: async (ctx, args) => {
    const toolFilters = await ctx.db
      .query("toolFilters")
      .withIndex("by_filter", (q) => q.eq("filterNodeId", args.filterNodeId))
      .collect();

    const tools = await Promise.all(
      toolFilters.map(async (tf) => {
        const tool = await ctx.db.get(tf.toolId);
        if (!tool) return null;

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
