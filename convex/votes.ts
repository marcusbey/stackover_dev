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
        await ctx.db.delete(existing._id);
        return { action: "removed" };
      }
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
