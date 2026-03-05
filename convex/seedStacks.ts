import { internalMutation } from "./_generated/server";

interface CuratedStackDef {
  name: string;
  slug: string;
  description: string;
  companyUrl: string;
  layers: { layerKey: string; toolSlugs: string[] }[];
}

const CURATED_STACKS: CuratedStackDef[] = [
  {
    name: "Vercel Stack",
    slug: "vercel-stack",
    description: "The stack behind Vercel — Next.js, Edge Functions, and modern web infra.",
    companyUrl: "https://vercel.com",
    layers: [
      { layerKey: "hosting", toolSlugs: ["vercel"] },
      { layerKey: "frontend", toolSlugs: ["nextjs"] },
      { layerKey: "database", toolSlugs: ["postgres", "redis"] },
      { layerKey: "analytics", toolSlugs: ["vercel-analytics"] },
      { layerKey: "monitoring", toolSlugs: ["vercel-analytics"] },
    ],
  },
  {
    name: "Stripe Stack",
    slug: "stripe-stack",
    description: "How Stripe powers the internet's payment infrastructure.",
    companyUrl: "https://stripe.com",
    layers: [
      { layerKey: "hosting", toolSlugs: ["aws"] },
      { layerKey: "backend", toolSlugs: ["ruby-on-rails"] },
      { layerKey: "database", toolSlugs: ["postgres", "redis"] },
      { layerKey: "payments", toolSlugs: ["stripe"] },
      { layerKey: "monitoring", toolSlugs: ["datadog"] },
    ],
  },
  {
    name: "GitHub Stack",
    slug: "github-stack",
    description: "The tools behind the world's largest code hosting platform.",
    companyUrl: "https://github.com",
    layers: [
      { layerKey: "hosting", toolSlugs: ["azure"] },
      { layerKey: "backend", toolSlugs: ["ruby-on-rails"] },
      { layerKey: "database", toolSlugs: ["mysql", "redis"] },
      { layerKey: "auth", toolSlugs: ["auth0"] },
      { layerKey: "cicd", toolSlugs: ["github-actions"] },
    ],
  },
  {
    name: "Shopify Stack",
    slug: "shopify-stack",
    description: "The commerce platform's tech stack powering millions of stores.",
    companyUrl: "https://shopify.com",
    layers: [
      { layerKey: "hosting", toolSlugs: ["gcp"] },
      { layerKey: "backend", toolSlugs: ["ruby-on-rails"] },
      { layerKey: "frontend", toolSlugs: ["react"] },
      { layerKey: "database", toolSlugs: ["mysql", "redis"] },
      { layerKey: "payments", toolSlugs: ["stripe"] },
    ],
  },
  {
    name: "Notion Stack",
    slug: "notion-stack",
    description: "The productivity tool that runs on a modern, flexible tech stack.",
    companyUrl: "https://notion.so",
    layers: [
      { layerKey: "hosting", toolSlugs: ["aws"] },
      { layerKey: "frontend", toolSlugs: ["react"] },
      { layerKey: "backend", toolSlugs: ["nodejs"] },
      { layerKey: "database", toolSlugs: ["postgres"] },
      { layerKey: "monitoring", toolSlugs: ["datadog"] },
    ],
  },
  {
    name: "Linear Stack",
    slug: "linear-stack",
    description: "How Linear builds the fastest project management tool.",
    companyUrl: "https://linear.app",
    layers: [
      { layerKey: "hosting", toolSlugs: ["vercel", "aws"] },
      { layerKey: "frontend", toolSlugs: ["nextjs"] },
      { layerKey: "backend", toolSlugs: ["nodejs"] },
      { layerKey: "database", toolSlugs: ["postgres"] },
      { layerKey: "auth", toolSlugs: ["auth0"] },
    ],
  },
];

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    for (const def of CURATED_STACKS) {
      // Check if already exists
      const existing = await ctx.db
        .query("stacks")
        .withIndex("by_slug", (q) => q.eq("slug", def.slug))
        .first();

      if (existing) continue;

      // Resolve tool slugs to IDs
      const layers = await Promise.all(
        def.layers.map(async (layer) => {
          const toolIds = (
            await Promise.all(
              layer.toolSlugs.map(async (slug) => {
                const tool = await ctx.db
                  .query("tools")
                  .withIndex("by_slug", (q) => q.eq("slug", slug))
                  .first();
                return tool?._id ?? null;
              })
            )
          ).filter(Boolean) as any[];

          return {
            layerKey: layer.layerKey,
            toolIds,
          };
        })
      );

      // Only include layers that resolved at least one tool
      const validLayers = layers.filter((l) => l.toolIds.length > 0);

      await ctx.db.insert("stacks", {
        slug: def.slug,
        name: def.name,
        description: def.description,
        visitorId: "system",
        isCurated: true,
        companyUrl: def.companyUrl,
        layers: validLayers,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
