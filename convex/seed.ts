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

    // --- Courses ---
    await ctx.db.insert("tools", {
      name: "Full Stack Open", slug: "full-stack-open",
      description: "Deep dive into modern web development with React, Node.js, GraphQL, and TypeScript.",
      logoUrl: "/logos/fullstackopen.svg", websiteUrl: "https://fullstackopen.com",
      type: "course", baselineScore: 9.0,
      pros: ["Free", "Comprehensive", "Project-based"], cons: ["Self-paced only"],
      isHot: false, isTrending: true, primaryCategory: "web",
      courseUrl: "https://fullstackopen.com/en/", provider: "University of Helsinki", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "CS50", slug: "cs50",
      description: "Harvard's intro to computer science and the art of programming.",
      logoUrl: "/logos/harvard.svg", websiteUrl: "https://cs50.harvard.edu",
      type: "course", baselineScore: 9.5,
      pros: ["World-class instruction", "Free", "Community"], cons: ["Time-intensive"],
      isHot: true, isTrending: false, primaryCategory: "web",
      courseUrl: "https://cs50.harvard.edu/x/", provider: "Harvard", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "fast.ai", slug: "fast-ai-course",
      description: "Practical deep learning for coders — making neural nets uncool again.",
      logoUrl: "/logos/fastai.svg", websiteUrl: "https://fast.ai",
      type: "course", baselineScore: 9.2,
      pros: ["Top-down approach", "Free", "PyTorch-based"], cons: ["Opinionated library"],
      isHot: true, isTrending: true, primaryCategory: "ai",
      courseUrl: "https://course.fast.ai/", provider: "fast.ai", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "The Odin Project", slug: "the-odin-project",
      description: "Full stack curriculum with Ruby on Rails and JavaScript paths.",
      logoUrl: "/logos/odinproject.svg", websiteUrl: "https://theodinproject.com",
      type: "course", baselineScore: 8.8,
      pros: ["100% free", "Open source", "Active community"], cons: ["Self-paced only"],
      isHot: false, isTrending: false, primaryCategory: "web",
      courseUrl: "https://theodinproject.com/", provider: "The Odin Project", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "Prompt Engineering Guide", slug: "prompt-engineering-guide",
      description: "Comprehensive guide to prompt engineering techniques for LLMs.",
      logoUrl: "/logos/dair.svg", websiteUrl: "https://promptingguide.ai",
      type: "course", baselineScore: 8.5,
      pros: ["Up-to-date", "Free", "Practical examples"], cons: ["Text-only"],
      isHot: false, isTrending: true, primaryCategory: "ai",
      courseUrl: "https://www.promptingguide.ai/", provider: "DAIR.AI", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "AWS Cloud Practitioner", slug: "aws-cloud-practitioner",
      description: "Foundational cloud concepts and AWS services overview.",
      logoUrl: "/logos/aws.svg", websiteUrl: "https://aws.amazon.com/training/",
      type: "course", baselineScore: 8.3,
      pros: ["Official certification", "Well-structured", "Industry recognized"], cons: ["AWS-specific", "Exam cost"],
      isHot: false, isTrending: false, primaryCategory: "cloud",
      courseUrl: "https://aws.amazon.com/training/learn-about/cloud-practitioner/", provider: "AWS", isFree: false,
    });

    // --- Resources ---
    await ctx.db.insert("tools", {
      name: "Awesome React", slug: "awesome-react",
      description: "Curated list of React libraries, tools, and resources.",
      logoUrl: "/logos/react.svg", websiteUrl: "https://github.com/enaqx/awesome-react",
      type: "resource", baselineScore: 8.7,
      pros: ["Comprehensive", "Community curated", "Always updated"], cons: ["Can be overwhelming"],
      isHot: false, isTrending: false, primaryCategory: "web",
      provider: "GitHub", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "AI Papers With Code", slug: "ai-papers-with-code",
      description: "Machine learning papers with linked code implementations.",
      logoUrl: "/logos/paperswithcode.svg", websiteUrl: "https://paperswithcode.com",
      type: "resource", baselineScore: 9.0,
      pros: ["Academic rigor", "Code included", "Benchmarks"], cons: ["Advanced level"],
      isHot: true, isTrending: true, primaryCategory: "ai",
      provider: "Papers With Code", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "DevOps Roadmap", slug: "devops-roadmap",
      description: "Step-by-step guide to becoming a modern DevOps engineer.",
      logoUrl: "/logos/roadmap.svg", websiteUrl: "https://roadmap.sh/devops",
      type: "resource", baselineScore: 8.6,
      pros: ["Visual learning path", "Community driven", "Free"], cons: ["Opinionated"],
      isHot: false, isTrending: true, primaryCategory: "cloud",
      provider: "roadmap.sh", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "System Design Primer", slug: "system-design-primer",
      description: "Learn how to design large-scale systems — prep for system design interviews.",
      logoUrl: "/logos/github.svg", websiteUrl: "https://github.com/donnemartin/system-design-primer",
      type: "resource", baselineScore: 9.3,
      pros: ["Extremely thorough", "Real-world examples", "Free"], cons: ["Very long"],
      isHot: true, isTrending: false, primaryCategory: "cloud",
      provider: "GitHub", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "Web.dev", slug: "web-dev",
      description: "Google's guidance for building modern, high-quality web experiences.",
      logoUrl: "/logos/google.svg", websiteUrl: "https://web.dev",
      type: "resource", baselineScore: 8.8,
      pros: ["Official Google guidance", "Performance focused", "Free"], cons: ["Chrome-centric"],
      isHot: false, isTrending: false, primaryCategory: "web",
      provider: "Google", isFree: true,
    });
    await ctx.db.insert("tools", {
      name: "Hugging Face Hub", slug: "hugging-face-hub",
      description: "The platform for sharing and discovering ML models, datasets, and demos.",
      logoUrl: "/logos/huggingface.svg", websiteUrl: "https://huggingface.co",
      type: "resource", baselineScore: 9.1,
      pros: ["Massive model library", "Community", "Free tier"], cons: ["Can be complex"],
      isHot: true, isTrending: true, primaryCategory: "ai",
      provider: "Hugging Face", isFree: true,
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
