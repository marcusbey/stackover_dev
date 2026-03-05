import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const cast = mutation({
  args: {
    visitorId: v.string(),
    toolId: v.id("tools"),
    category: v.string(),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categoryVotes")
      .withIndex("by_visitor_tool_category", (q) =>
        q
          .eq("visitorId", args.visitorId)
          .eq("toolId", args.toolId)
          .eq("category", args.category)
      )
      .first();

    if (existing) {
      if (existing.value === args.value) {
        await ctx.db.delete(existing._id);
        return { action: "removed" };
      }
      await ctx.db.patch(existing._id, {
        value: args.value,
        createdAt: Date.now(),
      });
      return { action: "changed" };
    }

    await ctx.db.insert("categoryVotes", {
      ...args,
      createdAt: Date.now(),
    });
    return { action: "created" };
  },
});

export const userVotes = query({
  args: {
    visitorId: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Return all votes for this visitor in this category
    // We need to scan by visitor and filter by category since we don't have
    // an index on just visitorId+category. Use the composite index.
    const allTools = await ctx.db
      .query("tools")
      .withIndex("by_primary_category", (q) =>
        q.eq("primaryCategory", args.category)
      )
      .collect();

    const votes: Record<string, number> = {};
    for (const tool of allTools) {
      const vote = await ctx.db
        .query("categoryVotes")
        .withIndex("by_visitor_tool_category", (q) =>
          q
            .eq("visitorId", args.visitorId)
            .eq("toolId", tool._id)
            .eq("category", args.category)
        )
        .first();
      if (vote) {
        votes[tool._id] = vote.value;
      }
    }
    return votes;
  },
});
