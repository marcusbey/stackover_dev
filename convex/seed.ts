import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("domains").first();
    if (existing) return "Already seeded";

    // --- Domains ---
    const aiId = await ctx.db.insert("domains", {
      name: "AI Models", slug: "ai-models", icon: "brain", order: 1,
    });
    const dbId = await ctx.db.insert("domains", {
      name: "Databases", slug: "databases", icon: "database", order: 2,
    });
    const fwId = await ctx.db.insert("domains", {
      name: "Frameworks", slug: "frameworks", icon: "layers", order: 3,
    });

    // --- Filter Nodes: AI Models ---
    const aiCoding = await ctx.db.insert("filterNodes", {
      label: "Coding", slug: "coding", domainId: aiId, order: 1,
    });
    const aiFrontend = await ctx.db.insert("filterNodes", {
      label: "Frontend", slug: "frontend", parentId: aiCoding, domainId: aiId, order: 1,
    });
    const aiBackend = await ctx.db.insert("filterNodes", {
      label: "Backend", slug: "backend", parentId: aiCoding, domainId: aiId, order: 2,
    });
    const aiImageGen = await ctx.db.insert("filterNodes", {
      label: "Image Generation", slug: "image-gen", domainId: aiId, order: 2,
    });
    const aiText = await ctx.db.insert("filterNodes", {
      label: "Text & Chat", slug: "text-chat", domainId: aiId, order: 3,
    });

    // --- Filter Nodes: Databases ---
    const dbRelational = await ctx.db.insert("filterNodes", {
      label: "Relational", slug: "relational", domainId: dbId, order: 1,
    });
    const dbDocument = await ctx.db.insert("filterNodes", {
      label: "Document", slug: "document", domainId: dbId, order: 2,
    });
    const dbVector = await ctx.db.insert("filterNodes", {
      label: "Vector", slug: "vector", domainId: dbId, order: 3,
    });

    // --- Filter Nodes: Frameworks ---
    const fwFrontend = await ctx.db.insert("filterNodes", {
      label: "Frontend", slug: "fw-frontend", domainId: fwId, order: 1,
    });
    const fwBackend = await ctx.db.insert("filterNodes", {
      label: "Backend", slug: "fw-backend", domainId: fwId, order: 2,
    });
    const fwFullstack = await ctx.db.insert("filterNodes", {
      label: "Full-Stack", slug: "fw-fullstack", domainId: fwId, order: 3,
    });

    // --- Tools ---
    const gpt4 = await ctx.db.insert("tools", {
      name: "GPT-4o", slug: "gpt-4o", description: "OpenAI's most capable model for code generation, reasoning, and multimodal tasks.",
      logoUrl: "/logos/openai.svg", websiteUrl: "https://openai.com", type: "saas",
      baselineScore: 9.2, pros: ["Excellent reasoning", "Multimodal", "Large context"], cons: ["Expensive", "Rate limits"], isHot: true, isTrending: false,
    });
    const claude = await ctx.db.insert("tools", {
      name: "Claude", slug: "claude", description: "Anthropic's AI assistant excelling at code, analysis, and long-context tasks.",
      logoUrl: "/logos/anthropic.svg", websiteUrl: "https://anthropic.com", type: "saas",
      baselineScore: 9.0, pros: ["200K context", "Strong at code", "Safety-focused"], cons: ["No image generation", "Availability"], isHot: true, isTrending: true,
    });
    const gemini = await ctx.db.insert("tools", {
      name: "Gemini", slug: "gemini", description: "Google's multimodal AI model with strong coding and reasoning capabilities.",
      logoUrl: "/logos/google.svg", websiteUrl: "https://gemini.google.com", type: "saas",
      baselineScore: 8.5, pros: ["Free tier", "Multimodal", "Fast"], cons: ["Inconsistent quality", "Less reliable for complex code"], isHot: false, isTrending: true,
    });
    const copilot = await ctx.db.insert("tools", {
      name: "GitHub Copilot", slug: "github-copilot", description: "AI pair programmer integrated directly into your IDE.",
      logoUrl: "/logos/github.svg", websiteUrl: "https://github.com/features/copilot", type: "saas",
      baselineScore: 8.8, pros: ["IDE integration", "Fast completions", "Context-aware"], cons: ["Subscription cost", "Privacy concerns"], isHot: false, isTrending: false,
    });
    const cursor = await ctx.db.insert("tools", {
      name: "Cursor", slug: "cursor", description: "AI-first code editor built on VS Code with deep AI integration.",
      logoUrl: "/logos/cursor.svg", websiteUrl: "https://cursor.com", type: "saas",
      baselineScore: 8.7, pros: ["Full-file editing", "Multi-model support", "Composer mode"], cons: ["Resource heavy", "Paid for pro features"], isHot: true, isTrending: true,
    });
    const midjourney = await ctx.db.insert("tools", {
      name: "Midjourney", slug: "midjourney", description: "Leading AI image generation with unmatched aesthetic quality.",
      logoUrl: "/logos/midjourney.svg", websiteUrl: "https://midjourney.com", type: "saas",
      baselineScore: 9.1, pros: ["Best aesthetics", "Active community", "Consistent quality"], cons: ["Discord-only UX", "No API"], isHot: false, isTrending: false,
    });
    const postgres = await ctx.db.insert("tools", {
      name: "PostgreSQL", slug: "postgresql", description: "The most advanced open-source relational database.",
      logoUrl: "/logos/postgresql.svg", websiteUrl: "https://postgresql.org", type: "tool",
      baselineScore: 9.3, pros: ["Battle-tested", "Extensions ecosystem", "ACID compliant"], cons: ["Complex tuning", "Hosting required"], isHot: false, isTrending: false,
      githubUrl: "https://github.com/postgres/postgres",
    });
    const mongodb = await ctx.db.insert("tools", {
      name: "MongoDB", slug: "mongodb", description: "Popular document database for flexible schema applications.",
      logoUrl: "/logos/mongodb.svg", websiteUrl: "https://mongodb.com", type: "tool",
      baselineScore: 8.0, pros: ["Flexible schema", "Easy to start", "Atlas cloud"], cons: ["No joins", "Consistency tradeoffs"], isHot: false, isTrending: false,
      githubUrl: "https://github.com/mongodb/mongo",
    });
    const pinecone = await ctx.db.insert("tools", {
      name: "Pinecone", slug: "pinecone", description: "Managed vector database purpose-built for AI applications.",
      logoUrl: "/logos/pinecone.svg", websiteUrl: "https://pinecone.io", type: "saas",
      baselineScore: 8.6, pros: ["Fully managed", "Fast similarity search", "Serverless"], cons: ["Vendor lock-in", "Cost at scale"], isHot: false, isTrending: true,
    });
    const supabase = await ctx.db.insert("tools", {
      name: "Supabase", slug: "supabase", description: "Open-source Firebase alternative with Postgres, Auth, and Realtime.",
      logoUrl: "/logos/supabase.svg", websiteUrl: "https://supabase.com", type: "saas",
      baselineScore: 8.9, pros: ["Postgres under hood", "Auth built-in", "Generous free tier"], cons: ["Edge functions limited", "Vendor coupling"], isHot: true, isTrending: true,
      githubUrl: "https://github.com/supabase/supabase",
    });
    const nextjs = await ctx.db.insert("tools", {
      name: "Next.js", slug: "nextjs", description: "The React framework for production with SSR, SSG, and App Router.",
      logoUrl: "/logos/nextjs.svg", websiteUrl: "https://nextjs.org", type: "tool",
      baselineScore: 9.4, pros: ["Full-stack React", "Vercel integration", "Server Components"], cons: ["Complex config", "Vercel-optimized"], isHot: true, isTrending: false,
      githubUrl: "https://github.com/vercel/next.js",
    });
    const react = await ctx.db.insert("tools", {
      name: "React", slug: "react", description: "The library for building user interfaces with components.",
      logoUrl: "/logos/react.svg", websiteUrl: "https://react.dev", type: "tool",
      baselineScore: 9.1, pros: ["Massive ecosystem", "Component model", "Server Components"], cons: ["Boilerplate", "Decision fatigue"], isHot: false, isTrending: false,
      githubUrl: "https://github.com/facebook/react",
    });
    const express = await ctx.db.insert("tools", {
      name: "Express", slug: "express", description: "Minimal and flexible Node.js web application framework.",
      logoUrl: "/logos/express.svg", websiteUrl: "https://expressjs.com", type: "tool",
      baselineScore: 7.8, pros: ["Simple", "Huge ecosystem", "Battle-tested"], cons: ["No built-in structure", "Callback-based"], isHot: false, isTrending: false,
      githubUrl: "https://github.com/expressjs/express",
    });
    const nuxt = await ctx.db.insert("tools", {
      name: "Nuxt", slug: "nuxt", description: "The intuitive Vue framework for building full-stack web apps.",
      logoUrl: "/logos/nuxt.svg", websiteUrl: "https://nuxt.com", type: "tool",
      baselineScore: 8.4, pros: ["Auto-imports", "File-based routing", "SEO-friendly"], cons: ["Smaller ecosystem", "Vue dependency"], isHot: false, isTrending: false,
      githubUrl: "https://github.com/nuxt/nuxt",
    });
    const v0Tool = await ctx.db.insert("tools", {
      name: "v0", slug: "v0", description: "Vercel's AI-powered UI generation tool using shadcn/ui components.",
      logoUrl: "/logos/v0.svg", websiteUrl: "https://v0.dev", type: "saas",
      baselineScore: 8.3, pros: ["Instant UI", "shadcn integration", "Iterative refinement"], cons: ["Limited customization", "React-only"], isHot: true, isTrending: true,
    });

    // --- Tool-Filter Mappings ---
    const mappings: [string, string][] = [
      // AI Models → Coding → Frontend
      [gpt4, aiFrontend], [claude, aiFrontend], [gemini, aiFrontend],
      [copilot, aiFrontend], [cursor, aiFrontend], [v0Tool, aiFrontend],
      // AI Models → Coding → Backend
      [gpt4, aiBackend], [claude, aiBackend], [gemini, aiBackend], [copilot, aiBackend],
      // AI Models → Coding (parent)
      [gpt4, aiCoding], [claude, aiCoding], [gemini, aiCoding],
      [copilot, aiCoding], [cursor, aiCoding],
      // AI Models → Image Generation
      [midjourney, aiImageGen],
      // AI Models → Text & Chat
      [gpt4, aiText], [claude, aiText], [gemini, aiText],
      // Databases
      [postgres, dbRelational], [supabase, dbRelational],
      [mongodb, dbDocument],
      [pinecone, dbVector],
      // Frameworks
      [nextjs, fwFrontend], [react, fwFrontend], [nuxt, fwFrontend],
      [express, fwBackend],
      [nextjs, fwFullstack], [nuxt, fwFullstack], [supabase, fwFullstack],
    ];

    for (const [toolId, filterNodeId] of mappings) {
      await ctx.db.insert("toolFilters", { toolId: toolId as any, filterNodeId: filterNodeId as any });
    }

    return "Seeded successfully";
  },
});
