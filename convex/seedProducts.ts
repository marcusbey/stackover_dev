import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

function buildSearchText(
  name: string,
  description: string,
  tags?: string[]
): string {
  const parts = [name, description];
  if (tags?.length) parts.push(...tags);
  return parts.join(" ");
}

export const insertBatch = mutation({
  args: {
    products: v.array(
      v.object({
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        websiteUrl: v.string(),
        tags: v.optional(v.array(v.string())),
        primaryCategory: v.optional(v.string()),
        type: v.union(v.literal("tool"), v.literal("saas")),
        baselineScore: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    for (const product of args.products) {
      // Duplicate check by slug
      const existing = await ctx.db
        .query("tools")
        .withIndex("by_slug", (q) => q.eq("slug", product.slug))
        .first();
      if (existing) continue;

      await ctx.db.insert("tools", {
        name: product.name,
        slug: product.slug,
        description: product.description,
        logoUrl: `/logos/${product.slug}.svg`,
        websiteUrl: product.websiteUrl,
        type: product.type,
        baselineScore: product.baselineScore,
        pros: [],
        cons: [],
        isHot: false,
        isTrending: false,
        tags: product.tags ?? [],
        primaryCategory: product.primaryCategory,
        searchText: buildSearchText(
          product.name,
          product.description,
          product.tags
        ),
      });
      inserted++;
    }
    return { inserted, skipped: args.products.length - inserted };
  },
});

export const backfillExisting = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();
    let patched = 0;

    // Category inference map based on existing seed data
    const categoryMap: Record<string, { tags: string[]; category: string }> = {
      "gpt-4o": { tags: ["ai", "llm", "coding", "chat"], category: "ai" },
      claude: { tags: ["ai", "llm", "coding", "chat"], category: "ai" },
      gemini: { tags: ["ai", "llm", "coding", "chat"], category: "ai" },
      "github-copilot": {
        tags: ["ai", "coding", "ide", "dev-tools"],
        category: "dev-tools",
      },
      cursor: {
        tags: ["ai", "coding", "ide", "dev-tools"],
        category: "dev-tools",
      },
      midjourney: {
        tags: ["ai", "image-generation", "design"],
        category: "ai",
      },
      postgresql: {
        tags: ["database", "sql", "relational", "open-source"],
        category: "databases",
      },
      mongodb: {
        tags: ["database", "nosql", "document", "cloud"],
        category: "databases",
      },
      pinecone: {
        tags: ["database", "vector", "ai", "search"],
        category: "databases",
      },
      supabase: {
        tags: ["database", "backend", "auth", "realtime"],
        category: "databases",
      },
      nextjs: {
        tags: ["framework", "react", "fullstack", "ssr"],
        category: "web",
      },
      react: {
        tags: ["framework", "frontend", "ui", "javascript"],
        category: "web",
      },
      express: {
        tags: ["framework", "backend", "nodejs", "api"],
        category: "web",
      },
      nuxt: {
        tags: ["framework", "vue", "fullstack", "ssr"],
        category: "web",
      },
      v0: { tags: ["ai", "design", "ui", "code-generation"], category: "ai" },
    };

    for (const tool of tools) {
      const mapping = categoryMap[tool.slug];
      if (!mapping) continue;

      await ctx.db.patch(tool._id, {
        tags: mapping.tags,
        primaryCategory: mapping.category,
        searchText: buildSearchText(tool.name, tool.description, mapping.tags),
      });
      patched++;
    }

    return { patched };
  },
});
