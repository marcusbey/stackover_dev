import { query } from "./_generated/server";

export const allToolSlugs = query({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();
    return tools.map((t) => ({
      slug: t.slug,
      name: t.name,
      primaryCategory: t.primaryCategory,
    }));
  },
});

export const allCategories = query({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();
    const categories = new Set<string>();
    for (const tool of tools) {
      if (tool.primaryCategory) {
        categories.add(tool.primaryCategory);
      }
    }
    return Array.from(categories);
  },
});
