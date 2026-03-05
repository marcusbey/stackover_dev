import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const stack = await ctx.db
      .query("stacks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!stack) return null;

    // Hydrate tool data for each layer
    const hydratedLayers = await Promise.all(
      stack.layers.map(async (layer) => {
        const tools = await Promise.all(
          layer.toolIds.map((id) => ctx.db.get(id))
        );
        return {
          layerKey: layer.layerKey,
          tools: tools.filter(Boolean),
        };
      })
    );

    return { ...stack, hydratedLayers };
  },
});

export const curated = query({
  args: {},
  handler: async (ctx) => {
    const stacks = await ctx.db
      .query("stacks")
      .withIndex("by_curated", (q) => q.eq("isCurated", true))
      .order("desc")
      .take(20);

    // Hydrate a preview of tools (first tool per layer) for gallery cards
    const withPreviews = await Promise.all(
      stacks.map(async (stack) => {
        const previewTools = await Promise.all(
          stack.layers.slice(0, 6).map(async (layer) => {
            if (layer.toolIds.length === 0) return null;
            return ctx.db.get(layer.toolIds[0]);
          })
        );
        return {
          ...stack,
          previewTools: previewTools.filter(Boolean),
        };
      })
    );

    return withPreviews;
  },
});

export const byVisitor = query({
  args: { visitorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stacks")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .order("desc")
      .take(50);
  },
});

export const toolsForLayer = query({
  args: {
    categories: v.array(v.string()),
    tagFilter: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const take = args.limit ?? 30;
    const allTools: any[] = [];

    for (const cat of args.categories) {
      const tools = await ctx.db
        .query("tools")
        .withIndex("by_primary_category", (q) =>
          q.eq("primaryCategory", cat)
        )
        .take(take);
      allTools.push(...tools);
    }

    // Deduplicate by _id
    const seen = new Set<string>();
    let unique = allTools.filter((t) => {
      if (seen.has(t._id)) return false;
      seen.add(t._id);
      return true;
    });

    // Apply tag filter if specified
    if (args.tagFilter) {
      const tag = args.tagFilter;
      const tagged = unique.filter((t) => t.tags?.includes(tag));
      // Fall back to unfiltered if tag filter yields nothing
      if (tagged.length > 0) {
        unique = tagged;
      }
    }

    // Sort by baselineScore desc
    unique.sort((a, b) => b.baselineScore - a.baselineScore);

    return unique.slice(0, take);
  },
});

export const save = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    visitorId: v.string(),
    layers: v.array(
      v.object({
        layerKey: v.string(),
        toolIds: v.array(v.id("tools")),
      })
    ),
    existingSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // If updating an existing stack
    if (args.existingSlug) {
      const existing = await ctx.db
        .query("stacks")
        .withIndex("by_slug", (q) => q.eq("slug", args.existingSlug!))
        .first();

      if (existing && existing.visitorId === args.visitorId) {
        await ctx.db.patch(existing._id, {
          name: args.name,
          description: args.description,
          layers: args.layers,
          updatedAt: now,
        });
        return { slug: existing.slug };
      }
    }

    // Generate slug from name + random suffix
    const baseSlug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const suffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${suffix}`;

    await ctx.db.insert("stacks", {
      slug,
      name: args.name,
      description: args.description,
      visitorId: args.visitorId,
      isCurated: false,
      layers: args.layers,
      createdAt: now,
      updatedAt: now,
    });

    return { slug };
  },
});
