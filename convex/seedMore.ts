import { internalMutation } from "./_generated/server";

export const seedCategories = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Guard: skip if we already have tools in frontend-libs
    const existing = await ctx.db
      .query("tools")
      .withIndex("by_primary_category", (q) =>
        q.eq("primaryCategory", "frontend-libs")
      )
      .first();
    if (existing) return "Already seeded extra categories";

    // ---- frontend-libs ----
    const shadcn = await ctx.db.insert("tools", {
      name: "shadcn/ui", slug: "shadcn-ui",
      description: "Beautifully designed components built with Radix UI and Tailwind CSS. Copy and paste into your apps.",
      logoUrl: "/logos/shadcn.svg", websiteUrl: "https://ui.shadcn.com", type: "tool",
      baselineScore: 9.4, pros: ["Full ownership", "Tailwind-native", "Accessible"], cons: ["Manual updates", "React-only"],
      isHot: true, isTrending: true, primaryCategory: "frontend-libs",
      githubUrl: "https://github.com/shadcn-ui/ui",
    });
    await ctx.db.insert("tools", {
      name: "Radix UI", slug: "radix-ui",
      description: "Unstyled, accessible UI primitives for building high-quality design systems and web apps.",
      logoUrl: "/logos/radix.svg", websiteUrl: "https://radix-ui.com", type: "tool",
      baselineScore: 9.1, pros: ["Fully accessible", "Unstyled", "Composable"], cons: ["Styling required", "Learning curve"],
      isHot: false, isTrending: true, primaryCategory: "frontend-libs",
      githubUrl: "https://github.com/radix-ui/primitives",
    });
    await ctx.db.insert("tools", {
      name: "Headless UI", slug: "headless-ui",
      description: "Completely unstyled, fully accessible UI components from the Tailwind CSS team.",
      logoUrl: "/logos/headlessui.svg", websiteUrl: "https://headlessui.com", type: "tool",
      baselineScore: 8.5, pros: ["Tailwind team", "Accessible", "Simple API"], cons: ["Limited components", "Less flexible than Radix"],
      isHot: false, isTrending: false, primaryCategory: "frontend-libs",
      githubUrl: "https://github.com/tailwindlabs/headlessui",
    });
    await ctx.db.insert("tools", {
      name: "React Aria", slug: "react-aria",
      description: "Adobe's library of React hooks for building accessible, high-quality UI components.",
      logoUrl: "/logos/adobe.svg", websiteUrl: "https://react-spectrum.adobe.com/react-aria/", type: "tool",
      baselineScore: 8.8, pros: ["Best accessibility", "Hook-based", "International"], cons: ["Complex API", "Verbose"],
      isHot: false, isTrending: false, primaryCategory: "frontend-libs",
      githubUrl: "https://github.com/adobe/react-spectrum",
    });
    await ctx.db.insert("tools", {
      name: "Mantine", slug: "mantine",
      description: "A fully featured React components library with 100+ hooks and components.",
      logoUrl: "/logos/mantine.svg", websiteUrl: "https://mantine.dev", type: "tool",
      baselineScore: 8.7, pros: ["Batteries included", "Great hooks", "Dark mode"], cons: ["Bundle size", "Opinionated"],
      isHot: false, isTrending: true, primaryCategory: "frontend-libs",
      githubUrl: "https://github.com/mantinedev/mantine",
    });

    // ---- backend-libs ----
    const expressTool = await ctx.db.insert("tools", {
      name: "Hono", slug: "hono",
      description: "Ultrafast web framework for the Edges. Works on Cloudflare Workers, Deno, Bun, and Node.js.",
      logoUrl: "/logos/hono.svg", websiteUrl: "https://hono.dev", type: "tool",
      baselineScore: 9.0, pros: ["Ultrafast", "Multi-runtime", "Tiny bundle"], cons: ["Smaller ecosystem", "Young project"],
      isHot: true, isTrending: true, primaryCategory: "backend-libs",
      githubUrl: "https://github.com/honojs/hono",
    });
    await ctx.db.insert("tools", {
      name: "Fastify", slug: "fastify",
      description: "Fast and low overhead web framework for Node.js with a powerful plugin architecture.",
      logoUrl: "/logos/fastify.svg", websiteUrl: "https://fastify.dev", type: "tool",
      baselineScore: 8.8, pros: ["Very fast", "Schema validation", "Plugin system"], cons: ["Smaller community", "Different paradigm"],
      isHot: false, isTrending: false, primaryCategory: "backend-libs",
      githubUrl: "https://github.com/fastify/fastify",
    });
    await ctx.db.insert("tools", {
      name: "tRPC", slug: "trpc",
      description: "End-to-end typesafe APIs made easy. Full type inference from backend to frontend.",
      logoUrl: "/logos/trpc.svg", websiteUrl: "https://trpc.io", type: "tool",
      baselineScore: 9.2, pros: ["Full type safety", "No codegen", "Great DX"], cons: ["TypeScript only", "Coupled frontend/backend"],
      isHot: true, isTrending: true, primaryCategory: "backend-libs",
      githubUrl: "https://github.com/trpc/trpc",
    });
    await ctx.db.insert("tools", {
      name: "Prisma", slug: "prisma",
      description: "Next-generation ORM for Node.js and TypeScript. Auto-generated, type-safe database client.",
      logoUrl: "/logos/prisma.svg", websiteUrl: "https://prisma.io", type: "tool",
      baselineScore: 8.9, pros: ["Type-safe", "Great migrations", "Multi-database"], cons: ["Performance overhead", "Cold starts"],
      isHot: false, isTrending: false, primaryCategory: "backend-libs",
      githubUrl: "https://github.com/prisma/prisma",
    });
    await ctx.db.insert("tools", {
      name: "Drizzle ORM", slug: "drizzle-orm",
      description: "TypeScript ORM that feels like writing SQL. Lightweight, performant, and serverless-ready.",
      logoUrl: "/logos/drizzle.svg", websiteUrl: "https://orm.drizzle.team", type: "tool",
      baselineScore: 9.0, pros: ["SQL-like syntax", "Lightweight", "Edge-ready"], cons: ["Younger ecosystem", "Less docs"],
      isHot: true, isTrending: true, primaryCategory: "backend-libs",
      githubUrl: "https://github.com/drizzle-team/drizzle-orm",
    });

    // ---- icons-fonts ----
    await ctx.db.insert("tools", {
      name: "Lucide", slug: "lucide-icons",
      description: "Beautiful and consistent icon library forked from Feather Icons. 1500+ icons with React/Vue/Svelte support.",
      logoUrl: "/logos/lucide.svg", websiteUrl: "https://lucide.dev", type: "tool",
      baselineScore: 9.2, pros: ["Huge icon set", "Tree-shakable", "Multi-framework"], cons: ["Fork of Feather", "Some missing icons"],
      isHot: true, isTrending: true, primaryCategory: "icons-fonts",
      githubUrl: "https://github.com/lucide-icons/lucide",
    });
    await ctx.db.insert("tools", {
      name: "Heroicons", slug: "heroicons",
      description: "Beautiful hand-crafted SVG icons by the makers of Tailwind CSS.",
      logoUrl: "/logos/heroicons.svg", websiteUrl: "https://heroicons.com", type: "tool",
      baselineScore: 8.8, pros: ["Tailwind team", "Clean design", "MIT license"], cons: ["Smaller set", "No filled variants"],
      isHot: false, isTrending: false, primaryCategory: "icons-fonts",
      githubUrl: "https://github.com/tailwindlabs/heroicons",
    });
    await ctx.db.insert("tools", {
      name: "Phosphor Icons", slug: "phosphor-icons",
      description: "Flexible icon family with 9000+ icons across 6 weights. React, Vue, and web components.",
      logoUrl: "/logos/phosphor.svg", websiteUrl: "https://phosphoricons.com", type: "tool",
      baselineScore: 8.6, pros: ["6 weights", "Huge collection", "Consistent"], cons: ["Bundle size", "Less popular"],
      isHot: false, isTrending: false, primaryCategory: "icons-fonts",
      githubUrl: "https://github.com/phosphor-icons/core",
    });
    await ctx.db.insert("tools", {
      name: "Geist Font", slug: "geist-font",
      description: "Vercel's typeface family designed for code and UI. Sans and Mono variants.",
      logoUrl: "/logos/vercel.svg", websiteUrl: "https://vercel.com/font", type: "tool",
      baselineScore: 8.5, pros: ["Beautiful for code", "Free", "Vercel-optimized"], cons: ["Limited weights", "New"],
      isHot: false, isTrending: true, primaryCategory: "icons-fonts",
    });
    await ctx.db.insert("tools", {
      name: "Google Fonts", slug: "google-fonts",
      description: "Free, open-source font library with 1500+ families. CDN-hosted with great performance.",
      logoUrl: "/logos/google.svg", websiteUrl: "https://fonts.google.com", type: "tool",
      baselineScore: 9.0, pros: ["Massive library", "Free", "CDN hosted"], cons: ["Privacy concerns", "FOUT possible"],
      isHot: false, isTrending: false, primaryCategory: "icons-fonts",
    });

    // ---- ai-agents ----
    await ctx.db.insert("tools", {
      name: "LangChain", slug: "langchain",
      description: "Framework for developing applications powered by language models. Chains, agents, and retrieval.",
      logoUrl: "/logos/langchain.svg", websiteUrl: "https://langchain.com", type: "tool",
      baselineScore: 8.7, pros: ["Comprehensive", "Active community", "Multi-model"], cons: ["Complex abstractions", "Frequent breaking changes"],
      isHot: true, isTrending: false, primaryCategory: "ai-agents",
      githubUrl: "https://github.com/langchain-ai/langchain",
    });
    await ctx.db.insert("tools", {
      name: "CrewAI", slug: "crewai",
      description: "Framework for orchestrating role-playing AI agents. Build collaborative multi-agent systems.",
      logoUrl: "/logos/crewai.svg", websiteUrl: "https://crewai.com", type: "tool",
      baselineScore: 8.3, pros: ["Multi-agent", "Role-based", "Easy to start"], cons: ["Python-only", "Early stage"],
      isHot: true, isTrending: true, primaryCategory: "ai-agents",
      githubUrl: "https://github.com/crewAIInc/crewAI",
    });
    await ctx.db.insert("tools", {
      name: "Vercel AI SDK", slug: "vercel-ai-sdk",
      description: "TypeScript toolkit for building AI-powered apps. Streaming, tools, and multi-model support.",
      logoUrl: "/logos/vercel.svg", websiteUrl: "https://sdk.vercel.ai", type: "tool",
      baselineScore: 9.0, pros: ["Great DX", "Streaming built-in", "Multi-provider"], cons: ["Vercel-optimized", "TypeScript only"],
      isHot: true, isTrending: true, primaryCategory: "ai-agents",
      githubUrl: "https://github.com/vercel/ai",
    });
    await ctx.db.insert("tools", {
      name: "OpenAI Assistants", slug: "openai-assistants",
      description: "Build AI assistants with file search, code interpreter, and function calling via OpenAI's API.",
      logoUrl: "/logos/openai.svg", websiteUrl: "https://platform.openai.com/docs/assistants", type: "saas",
      baselineScore: 8.8, pros: ["Powerful tools", "Hosted", "Code interpreter"], cons: ["Vendor lock-in", "Cost"],
      isHot: false, isTrending: false, primaryCategory: "ai-agents",
    });
    await ctx.db.insert("tools", {
      name: "AutoGen", slug: "autogen",
      description: "Microsoft's framework for building multi-agent conversational AI systems.",
      logoUrl: "/logos/microsoft.svg", websiteUrl: "https://microsoft.github.io/autogen/", type: "tool",
      baselineScore: 8.2, pros: ["Microsoft-backed", "Multi-agent", "Flexible"], cons: ["Complex setup", "Python-only"],
      isHot: false, isTrending: false, primaryCategory: "ai-agents",
      githubUrl: "https://github.com/microsoft/autogen",
    });

    // ---- ai-image ----
    await ctx.db.insert("tools", {
      name: "DALL-E 3", slug: "dall-e-3",
      description: "OpenAI's image generation model with strong prompt understanding and text rendering.",
      logoUrl: "/logos/openai.svg", websiteUrl: "https://openai.com/dall-e-3", type: "saas",
      baselineScore: 8.9, pros: ["Great text in images", "API access", "Safety filters"], cons: ["Expensive", "Less artistic"],
      isHot: false, isTrending: false, primaryCategory: "ai-image",
    });
    await ctx.db.insert("tools", {
      name: "Stable Diffusion", slug: "stable-diffusion",
      description: "Open-source image generation model. Run locally or via API. Huge community and model ecosystem.",
      logoUrl: "/logos/stability.svg", websiteUrl: "https://stability.ai", type: "tool",
      baselineScore: 9.0, pros: ["Open source", "Run locally", "Huge ecosystem"], cons: ["Hardware required", "Complex setup"],
      isHot: false, isTrending: true, primaryCategory: "ai-image",
      githubUrl: "https://github.com/Stability-AI/stablediffusion",
    });
    await ctx.db.insert("tools", {
      name: "Leonardo.ai", slug: "leonardo-ai",
      description: "AI image generation platform with fine-tuned models, real-time canvas, and game asset tools.",
      logoUrl: "/logos/leonardo.svg", websiteUrl: "https://leonardo.ai", type: "saas",
      baselineScore: 8.5, pros: ["Game assets", "Fine-tuning", "Real-time canvas"], cons: ["Credits system", "Watermarks on free"],
      isHot: false, isTrending: false, primaryCategory: "ai-image",
    });
    await ctx.db.insert("tools", {
      name: "Replicate", slug: "replicate",
      description: "Run open-source AI models in the cloud via a simple API. Image, video, audio, and text.",
      logoUrl: "/logos/replicate.svg", websiteUrl: "https://replicate.com", type: "saas",
      baselineScore: 8.7, pros: ["Any model", "Simple API", "Pay per use"], cons: ["Cold starts", "Cost at scale"],
      isHot: true, isTrending: true, primaryCategory: "ai-image",
    });
    await ctx.db.insert("tools", {
      name: "Flux", slug: "flux-ai",
      description: "State-of-the-art open image generation from Black Forest Labs. Fast, high-quality outputs.",
      logoUrl: "/logos/flux.svg", websiteUrl: "https://blackforestlabs.ai", type: "tool",
      baselineScore: 9.1, pros: ["Top quality", "Fast inference", "Open weights"], cons: ["Resource intensive", "New"],
      isHot: true, isTrending: true, primaryCategory: "ai-image",
    });

    // ---- ai-coding ----
    await ctx.db.insert("tools", {
      name: "Codeium", slug: "codeium",
      description: "Free AI code completion and chat for 70+ languages. IDE extensions for VS Code, JetBrains, and more.",
      logoUrl: "/logos/codeium.svg", websiteUrl: "https://codeium.com", type: "saas",
      baselineScore: 8.4, pros: ["Free tier", "Multi-IDE", "Fast"], cons: ["Less accurate", "Limited context"],
      isHot: false, isTrending: false, primaryCategory: "ai-coding",
    });
    await ctx.db.insert("tools", {
      name: "Tabnine", slug: "tabnine",
      description: "AI code assistant that runs on your machine for privacy. Supports all major IDEs.",
      logoUrl: "/logos/tabnine.svg", websiteUrl: "https://tabnine.com", type: "saas",
      baselineScore: 8.0, pros: ["Local model option", "Privacy", "Multi-IDE"], cons: ["Less capable", "Paid for best models"],
      isHot: false, isTrending: false, primaryCategory: "ai-coding",
    });
    await ctx.db.insert("tools", {
      name: "Windsurf", slug: "windsurf",
      description: "AI-native IDE by Codeium with deep codebase understanding and multi-file editing.",
      logoUrl: "/logos/windsurf.svg", websiteUrl: "https://windsurf.com", type: "saas",
      baselineScore: 8.6, pros: ["Deep context", "Multi-file edits", "Free tier"], cons: ["New product", "VS Code fork"],
      isHot: true, isTrending: true, primaryCategory: "ai-coding",
    });
    await ctx.db.insert("tools", {
      name: "Aider", slug: "aider",
      description: "AI pair programming in your terminal. Works with any LLM to edit code in your git repo.",
      logoUrl: "/logos/aider.svg", websiteUrl: "https://aider.chat", type: "tool",
      baselineScore: 8.7, pros: ["Terminal-based", "Git-aware", "Any LLM"], cons: ["CLI only", "Learning curve"],
      isHot: false, isTrending: true, primaryCategory: "ai-coding",
      githubUrl: "https://github.com/paul-gauthier/aider",
    });
    await ctx.db.insert("tools", {
      name: "Claude Code", slug: "claude-code",
      description: "Anthropic's agentic coding tool. Think, plan, and execute complex software tasks from the terminal.",
      logoUrl: "/logos/anthropic.svg", websiteUrl: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview", type: "saas",
      baselineScore: 9.3, pros: ["Agentic coding", "Deep reasoning", "Terminal-native"], cons: ["API costs", "New product"],
      isHot: true, isTrending: true, primaryCategory: "ai-coding",
    });

    // ---- ui-kits ----
    await ctx.db.insert("tools", {
      name: "Material UI", slug: "material-ui",
      description: "React components that implement Google's Material Design. The most popular React UI library.",
      logoUrl: "/logos/mui.svg", websiteUrl: "https://mui.com", type: "tool",
      baselineScore: 8.5, pros: ["Comprehensive", "Enterprise-ready", "Huge community"], cons: ["Bundle size", "Opinionated design"],
      isHot: false, isTrending: false, primaryCategory: "ui-kits",
      githubUrl: "https://github.com/mui/material-ui",
    });
    await ctx.db.insert("tools", {
      name: "Ant Design", slug: "ant-design",
      description: "Enterprise-class UI design language and React component library from Alibaba.",
      logoUrl: "/logos/antd.svg", websiteUrl: "https://ant.design", type: "tool",
      baselineScore: 8.3, pros: ["Full design system", "Enterprise features", "Great tables"], cons: ["Large bundle", "Chinese-first docs"],
      isHot: false, isTrending: false, primaryCategory: "ui-kits",
      githubUrl: "https://github.com/ant-design/ant-design",
    });
    await ctx.db.insert("tools", {
      name: "Chakra UI", slug: "chakra-ui",
      description: "Simple, modular React components with built-in accessibility and dark mode support.",
      logoUrl: "/logos/chakra.svg", websiteUrl: "https://chakra-ui.com", type: "tool",
      baselineScore: 8.4, pros: ["Simple API", "Accessible", "Themeable"], cons: ["Performance", "Smaller ecosystem"],
      isHot: false, isTrending: false, primaryCategory: "ui-kits",
      githubUrl: "https://github.com/chakra-ui/chakra-ui",
    });
    await ctx.db.insert("tools", {
      name: "DaisyUI", slug: "daisyui",
      description: "The most popular component library for Tailwind CSS. Clean HTML with semantic class names.",
      logoUrl: "/logos/daisyui.svg", websiteUrl: "https://daisyui.com", type: "tool",
      baselineScore: 8.6, pros: ["Tailwind plugin", "Themeable", "No JS required"], cons: ["Less interactive", "Class-name-based"],
      isHot: false, isTrending: true, primaryCategory: "ui-kits",
      githubUrl: "https://github.com/saadeghi/daisyui",
    });
    await ctx.db.insert("tools", {
      name: "Park UI", slug: "park-ui",
      description: "Beautifully designed components built on Ark UI. Available for React, Vue, and Solid.",
      logoUrl: "/logos/parkui.svg", websiteUrl: "https://park-ui.com", type: "tool",
      baselineScore: 8.2, pros: ["Multi-framework", "Beautiful defaults", "Ark-based"], cons: ["New project", "Smaller community"],
      isHot: false, isTrending: true, primaryCategory: "ui-kits",
      githubUrl: "https://github.com/cschroeter/park-ui",
    });

    // ---- prototyping ----
    await ctx.db.insert("tools", {
      name: "Figma", slug: "figma",
      description: "The collaborative interface design tool. Design, prototype, and develop in one platform.",
      logoUrl: "/logos/figma.svg", websiteUrl: "https://figma.com", type: "saas",
      baselineScore: 9.5, pros: ["Real-time collab", "Plugins ecosystem", "Dev mode"], cons: ["Subscription cost", "Performance on large files"],
      isHot: true, isTrending: false, primaryCategory: "prototyping",
    });
    await ctx.db.insert("tools", {
      name: "Framer", slug: "framer",
      description: "Design and publish stunning sites with AI-powered tools and zero code.",
      logoUrl: "/logos/framer.svg", websiteUrl: "https://framer.com", type: "saas",
      baselineScore: 8.8, pros: ["No code publishing", "Great animations", "CMS built-in"], cons: ["Limited for apps", "Vendor lock-in"],
      isHot: true, isTrending: true, primaryCategory: "prototyping",
    });
    await ctx.db.insert("tools", {
      name: "Penpot", slug: "penpot",
      description: "The first open-source design tool for design and code collaboration.",
      logoUrl: "/logos/penpot.svg", websiteUrl: "https://penpot.app", type: "tool",
      baselineScore: 8.2, pros: ["Open source", "Self-hostable", "SVG-native"], cons: ["Less polished", "Fewer plugins"],
      isHot: false, isTrending: true, primaryCategory: "prototyping",
      githubUrl: "https://github.com/penpot/penpot",
    });
    await ctx.db.insert("tools", {
      name: "Excalidraw", slug: "excalidraw",
      description: "Virtual whiteboard for sketching hand-drawn-like diagrams. Simple, fast, collaborative.",
      logoUrl: "/logos/excalidraw.svg", websiteUrl: "https://excalidraw.com", type: "tool",
      baselineScore: 8.9, pros: ["Hand-drawn style", "Fast", "Collaborative"], cons: ["Not for high-fidelity", "Limited shapes"],
      isHot: false, isTrending: false, primaryCategory: "prototyping",
      githubUrl: "https://github.com/excalidraw/excalidraw",
    });
    await ctx.db.insert("tools", {
      name: "Whimsical", slug: "whimsical",
      description: "Docs, wireframes, flowcharts, and mind maps. Think and collaborate visually.",
      logoUrl: "/logos/whimsical.svg", websiteUrl: "https://whimsical.com", type: "saas",
      baselineScore: 8.4, pros: ["All-in-one", "Beautiful defaults", "Fast"], cons: ["Limited free tier", "No prototyping"],
      isHot: false, isTrending: false, primaryCategory: "prototyping",
    });

    // ---- design-systems ----
    await ctx.db.insert("tools", {
      name: "Storybook", slug: "storybook",
      description: "The industry-standard tool for building, documenting, and testing UI components in isolation.",
      logoUrl: "/logos/storybook.svg", websiteUrl: "https://storybook.js.org", type: "tool",
      baselineScore: 9.1, pros: ["Industry standard", "Multi-framework", "Addons"], cons: ["Config complexity", "Slow builds"],
      isHot: false, isTrending: false, primaryCategory: "design-systems",
      githubUrl: "https://github.com/storybookjs/storybook",
    });
    await ctx.db.insert("tools", {
      name: "Chromatic", slug: "chromatic",
      description: "Visual testing and review platform for Storybook. Catch UI bugs before they ship.",
      logoUrl: "/logos/chromatic.svg", websiteUrl: "https://chromatic.com", type: "saas",
      baselineScore: 8.6, pros: ["Visual regression", "Storybook integration", "CI/CD"], cons: ["Cost at scale", "Storybook-dependent"],
      isHot: false, isTrending: false, primaryCategory: "design-systems",
    });
    await ctx.db.insert("tools", {
      name: "Style Dictionary", slug: "style-dictionary",
      description: "Amazon's build system for design tokens. Transform tokens to any platform format.",
      logoUrl: "/logos/amazon.svg", websiteUrl: "https://amzn.github.io/style-dictionary/", type: "tool",
      baselineScore: 8.3, pros: ["Platform agnostic", "Extensible", "Amazon-backed"], cons: ["Config heavy", "Learning curve"],
      isHot: false, isTrending: false, primaryCategory: "design-systems",
      githubUrl: "https://github.com/amzn/style-dictionary",
    });
    await ctx.db.insert("tools", {
      name: "Tokens Studio", slug: "tokens-studio",
      description: "Figma plugin for managing design tokens. Sync tokens to code with GitHub/GitLab integration.",
      logoUrl: "/logos/tokens-studio.svg", websiteUrl: "https://tokens.studio", type: "saas",
      baselineScore: 8.4, pros: ["Figma plugin", "Git sync", "Token management"], cons: ["Paid for teams", "Complex workflows"],
      isHot: false, isTrending: true, primaryCategory: "design-systems",
    });
    await ctx.db.insert("tools", {
      name: "Tailwind CSS", slug: "tailwindcss",
      description: "A utility-first CSS framework for rapidly building custom user interfaces.",
      logoUrl: "/logos/tailwind.svg", websiteUrl: "https://tailwindcss.com", type: "tool",
      baselineScore: 9.5, pros: ["Rapid development", "Consistent", "Great DX"], cons: ["HTML bloat", "Learning curve"],
      isHot: true, isTrending: false, primaryCategory: "design-systems",
      githubUrl: "https://github.com/tailwindlabs/tailwindcss",
    });

    // ---- Curated Company Stacks ----
    // Look up existing tools by slug for stack references
    const findTool = async (slug: string) => {
      return await ctx.db
        .query("tools")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
    };

    const now = Date.now();
    const toolMap: Record<string, string> = {};
    const slugsNeeded = [
      "nextjs", "react", "postgresql", "supabase", "vercel-ai-sdk",
      "tailwindcss", "prisma", "shadcn-ui", "figma", "hono",
      "drizzle-orm", "storybook",
    ];
    for (const s of slugsNeeded) {
      const t = await findTool(s);
      if (t) toolMap[s] = t._id;
    }

    // Vercel Stack
    await ctx.db.insert("stacks", {
      slug: "vercel-stack", name: "Vercel",
      description: "The stack behind Vercel's dashboard and v0.dev",
      visitorId: "system", isCurated: true,
      companyLogoUrl: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
      companyUrl: "https://vercel.com",
      layers: [
        { layerKey: "Framework", toolIds: [toolMap["nextjs"]].filter(Boolean) as any[] },
        { layerKey: "UI Library", toolIds: [toolMap["react"], toolMap["shadcn-ui"]].filter(Boolean) as any[] },
        { layerKey: "Styling", toolIds: [toolMap["tailwindcss"]].filter(Boolean) as any[] },
        { layerKey: "Database", toolIds: [toolMap["postgresql"]].filter(Boolean) as any[] },
        { layerKey: "AI", toolIds: [toolMap["vercel-ai-sdk"]].filter(Boolean) as any[] },
      ],
      createdAt: now, updatedAt: now,
    });

    // Linear Stack
    await ctx.db.insert("stacks", {
      slug: "linear-stack", name: "Linear",
      description: "The stack powering the best project management tool",
      visitorId: "system", isCurated: true,
      companyLogoUrl: "https://www.google.com/s2/favicons?domain=linear.app&sz=128",
      companyUrl: "https://linear.app",
      layers: [
        { layerKey: "Framework", toolIds: [toolMap["nextjs"]].filter(Boolean) as any[] },
        { layerKey: "UI Library", toolIds: [toolMap["react"]].filter(Boolean) as any[] },
        { layerKey: "Database", toolIds: [toolMap["postgresql"]].filter(Boolean) as any[] },
        { layerKey: "Design", toolIds: [toolMap["figma"]].filter(Boolean) as any[] },
      ],
      createdAt: now, updatedAt: now,
    });

    // Cal.com Stack
    await ctx.db.insert("stacks", {
      slug: "calcom-stack", name: "Cal.com",
      description: "The open-source scheduling infrastructure",
      visitorId: "system", isCurated: true,
      companyLogoUrl: "https://www.google.com/s2/favicons?domain=cal.com&sz=128",
      companyUrl: "https://cal.com",
      layers: [
        { layerKey: "Framework", toolIds: [toolMap["nextjs"]].filter(Boolean) as any[] },
        { layerKey: "UI Library", toolIds: [toolMap["react"], toolMap["shadcn-ui"]].filter(Boolean) as any[] },
        { layerKey: "ORM", toolIds: [toolMap["prisma"]].filter(Boolean) as any[] },
        { layerKey: "Database", toolIds: [toolMap["postgresql"]].filter(Boolean) as any[] },
        { layerKey: "Styling", toolIds: [toolMap["tailwindcss"]].filter(Boolean) as any[] },
      ],
      createdAt: now, updatedAt: now,
    });

    // Supabase Stack
    await ctx.db.insert("stacks", {
      slug: "supabase-stack", name: "Supabase",
      description: "The open-source Firebase alternative's own stack",
      visitorId: "system", isCurated: true,
      companyLogoUrl: "https://www.google.com/s2/favicons?domain=supabase.com&sz=128",
      companyUrl: "https://supabase.com",
      layers: [
        { layerKey: "Framework", toolIds: [toolMap["nextjs"]].filter(Boolean) as any[] },
        { layerKey: "Database", toolIds: [toolMap["postgresql"]].filter(Boolean) as any[] },
        { layerKey: "Styling", toolIds: [toolMap["tailwindcss"]].filter(Boolean) as any[] },
        { layerKey: "Design", toolIds: [toolMap["figma"], toolMap["storybook"]].filter(Boolean) as any[] },
      ],
      createdAt: now, updatedAt: now,
    });

    // Notion Stack
    await ctx.db.insert("stacks", {
      slug: "notion-stack", name: "Notion",
      description: "The all-in-one workspace's engineering stack",
      visitorId: "system", isCurated: true,
      companyLogoUrl: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
      companyUrl: "https://notion.so",
      layers: [
        { layerKey: "UI Library", toolIds: [toolMap["react"]].filter(Boolean) as any[] },
        { layerKey: "Database", toolIds: [toolMap["postgresql"]].filter(Boolean) as any[] },
        { layerKey: "Design", toolIds: [toolMap["figma"]].filter(Boolean) as any[] },
      ],
      createdAt: now, updatedAt: now,
    });

    // Stripe Stack
    await ctx.db.insert("stacks", {
      slug: "stripe-stack", name: "Stripe",
      description: "The payments giant's frontend engineering stack",
      visitorId: "system", isCurated: true,
      companyLogoUrl: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
      companyUrl: "https://stripe.com",
      layers: [
        { layerKey: "UI Library", toolIds: [toolMap["react"]].filter(Boolean) as any[] },
        { layerKey: "Database", toolIds: [toolMap["postgresql"]].filter(Boolean) as any[] },
        { layerKey: "Design", toolIds: [toolMap["figma"], toolMap["storybook"]].filter(Boolean) as any[] },
      ],
      createdAt: now, updatedAt: now,
    });

    return "Seeded extra categories + company stacks";
  },
});
