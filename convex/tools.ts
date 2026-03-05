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
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const take = args.limit ?? 20;

    // Use search index for full-text search
    let results = await ctx.db
      .query("tools")
      .withSearchIndex("search_tools", (q) => {
        let search = q.search("searchText", args.query);
        if (args.category) {
          search = search.eq("primaryCategory", args.category);
        }
        return search;
      })
      .take(take);

    // Fallback: if search index returns nothing (e.g. tools without searchText),
    // fall back to simple string matching
    if (results.length === 0) {
      const all = await ctx.db.query("tools").take(500);
      const lq = args.query.toLowerCase();
      results = all
        .filter(
          (t) =>
            t.name.toLowerCase().includes(lq) ||
            t.description.toLowerCase().includes(lq)
        )
        .slice(0, take);
    }

    return results;
  },
});

export const featured = query({
  args: {},
  handler: async (ctx) => {
    const categories = ["ai", "dev-tools", "databases", "web", "cloud", "design", "hosting"];
    const sections: { category: string; tools: any[] }[] = [];

    for (const cat of categories) {
      const tools = await ctx.db
        .query("tools")
        .withIndex("by_primary_category", (q) =>
          q.eq("primaryCategory", cat)
        )
        .take(6);
      if (tools.length > 0) {
        sections.push({ category: cat, tools });
      }
    }

    return sections;
  },
});

export const byCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const take = args.limit ?? 50;
    return await ctx.db
      .query("tools")
      .withIndex("by_primary_category", (q) =>
        q.eq("primaryCategory", args.category)
      )
      .take(take);
  },
});

export const byTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const take = args.limit ?? 30;
    // Use search index to find tools, then post-filter by tag
    const results = await ctx.db
      .query("tools")
      .withSearchIndex("search_tools", (q) =>
        q.search("searchText", args.tag)
      )
      .take(take * 3);

    return results
      .filter((t) => t.tags?.includes(args.tag))
      .slice(0, take);
  },
});

export const byCategoryRanked = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const tools = await ctx.db
      .query("tools")
      .withIndex("by_primary_category", (q) =>
        q.eq("primaryCategory", args.category)
      )
      .collect();

    const ranked = await Promise.all(
      tools.map(async (tool) => {
        const votes = await ctx.db
          .query("categoryVotes")
          .withIndex("by_tool_category", (q) =>
            q.eq("toolId", tool._id).eq("category", args.category)
          )
          .collect();

        const upvotes = votes.filter((v) => v.value === 1).length;
        const downvotes = votes.filter((v) => v.value === -1).length;
        const netVotes = upvotes - downvotes;

        return {
          ...tool,
          upvotes,
          downvotes,
          netVotes,
          voteCount: votes.length,
        };
      })
    );

    return ranked.sort((a, b) => {
      if (b.netVotes !== a.netVotes) return b.netVotes - a.netVotes;
      return b.baselineScore - a.baselineScore;
    });
  },
});

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
