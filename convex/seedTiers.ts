import { mutation } from "./_generated/server";

export const seedTiers = mutation({
  args: {},
  handler: async (ctx) => {
    const allTools = await ctx.db.query("tools").collect();
    const bySlug = new Map(allTools.map((t) => [t.slug, t]));

    // Helper to resolve slug to ID
    const id = (slug: string) => bySlug.get(slug)?._id;

    // --- Vanilla tools (infrastructure primitives) ---
    const vanillaSlugs = [
      "react", "nextjs", "express", "nuxtjs", "vuejs", "angular", "svelte", "sveltekit",
      "postgresql", "mongodb", "mysql", "redis", "sqlite",
      "tailwind-css", "shadcn-ui", "radix-ui",
      "prisma", "drizzle-orm",
      "langchain", "stable-diffusion",
      "storybook", "hono", "fastify", "trpc",
      "nodejs", "python", "typescript", "rust", "go",
      "docker", "kubernetes",
      "graphql", "rest-api",
      "django", "flask", "rails", "laravel",
      "pytorch", "tensorflow", "hugging-face",
      "webpack", "vite", "turbopack", "esbuild",
      "jest", "vitest", "playwright", "cypress",
      "git", "linux",
      "stripe-api", "twilio",
      "aws-lambda", "cloudflare-workers",
      "remix", "astro", "gatsby",
      "zustand", "tanstack-query", "redux",
      "deno", "bun",
      "convex", "firebase",
    ];

    // --- Product tools (SaaS built on primitives) ---
    const productDefinitions: { slug: string; builtWith: string[] }[] = [
      { slug: "supabase", builtWith: ["postgresql"] },
      { slug: "vercel-ai-sdk", builtWith: ["nextjs", "react"] },
      { slug: "v0", builtWith: ["react", "shadcn-ui", "tailwind-css"] },
      { slug: "cursor", builtWith: [] },
      { slug: "github-copilot", builtWith: [] },
      { slug: "pinecone", builtWith: [] },
      { slug: "gpt-4o", builtWith: [] },
      { slug: "claude", builtWith: [] },
      { slug: "gemini", builtWith: [] },
      { slug: "midjourney", builtWith: [] },
      { slug: "figma", builtWith: [] },
      { slug: "framer", builtWith: ["react"] },
      { slug: "chromatic", builtWith: ["storybook"] },
      { slug: "vercel", builtWith: ["nextjs"] },
      { slug: "netlify", builtWith: [] },
      { slug: "railway", builtWith: [] },
      { slug: "planetscale", builtWith: ["mysql"] },
      { slug: "neon", builtWith: ["postgresql"] },
      { slug: "clerk", builtWith: ["react", "nextjs"] },
      { slug: "auth0", builtWith: [] },
      { slug: "stripe", builtWith: [] },
      { slug: "resend", builtWith: ["react"] },
      { slug: "sentry", builtWith: [] },
      { slug: "datadog", builtWith: [] },
      { slug: "amplitude", builtWith: [] },
      { slug: "posthog", builtWith: [] },
      { slug: "linear", builtWith: ["react"] },
      { slug: "notion", builtWith: [] },
      { slug: "retool", builtWith: ["react"] },
      { slug: "sanity", builtWith: ["react"] },
      { slug: "contentful", builtWith: [] },
      { slug: "algolia", builtWith: [] },
      { slug: "twilio", builtWith: [] },
      { slug: "sendgrid", builtWith: [] },
      { slug: "weaviate", builtWith: [] },
      { slug: "chroma", builtWith: ["python"] },
      { slug: "replicate", builtWith: [] },
      { slug: "together-ai", builtWith: [] },
      { slug: "groq", builtWith: [] },
      { slug: "perplexity", builtWith: [] },
      { slug: "windsurf", builtWith: [] },
      { slug: "bolt", builtWith: ["react"] },
      { slug: "lovable", builtWith: ["react"] },
      { slug: "replit", builtWith: [] },
      { slug: "github", builtWith: [] },
      { slug: "gitlab", builtWith: [] },
      { slug: "render", builtWith: [] },
      { slug: "fly-io", builtWith: [] },
      { slug: "upstash", builtWith: ["redis"] },
      { slug: "turso", builtWith: ["sqlite"] },
    ];

    let updated = 0;

    // Set vanilla tools
    for (const slug of vanillaSlugs) {
      const tool = bySlug.get(slug);
      if (tool && tool.type !== "course" && tool.type !== "resource") {
        await ctx.db.patch(tool._id, { tier: "vanilla" });
        updated++;
      }
    }

    // Set product tools
    for (const def of productDefinitions) {
      const tool = bySlug.get(def.slug);
      if (tool && tool.type !== "course" && tool.type !== "resource") {
        const builtWithIds = def.builtWith
          .map((s) => id(s))
          .filter((x): x is NonNullable<typeof x> => x !== undefined);

        await ctx.db.patch(tool._id, {
          tier: "product",
          ...(builtWithIds.length > 0 ? { builtWithToolIds: builtWithIds } : {}),
        });
        updated++;
      }
    }

    return `Updated ${updated} tools with tier data`;
  },
});
