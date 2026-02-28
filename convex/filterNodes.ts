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
