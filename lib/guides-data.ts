export interface Guide {
  slug: string;
  title: string;
  description: string;
  steps: string[];
  categories: string[];
  icon: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "saas-starter-stack",
    title: "The SaaS Starter Stack",
    description:
      "Everything you need to build and launch a SaaS product: framework, database, auth, payments, and deployment.",
    steps: ["Next.js", "PostgreSQL", "Better Auth", "Stripe", "Vercel"],
    categories: ["web", "databases", "auth", "payments", "hosting"],
    icon: "rocket",
  },
  {
    slug: "ai-app-stack",
    title: "The AI App Stack",
    description:
      "Build AI-powered applications with the best models, vector databases, and agent frameworks.",
    steps: ["OpenAI / Claude", "LangChain", "Pinecone", "Next.js", "Vercel AI SDK"],
    categories: ["ai", "ai-agents", "databases", "web"],
    icon: "sparkles",
  },
  {
    slug: "ecommerce-stack",
    title: "The E-Commerce Stack",
    description:
      "Launch an online store with a modern stack: storefront, cart, payments, and shipping.",
    steps: ["Next.js", "Shopify Storefront API", "Stripe", "Algolia", "Vercel"],
    categories: ["ecommerce", "payments", "search", "web"],
    icon: "shopping-cart",
  },
  {
    slug: "mobile-app-stack",
    title: "The Mobile App Stack",
    description:
      "Ship a cross-platform mobile app with a shared codebase, backend, and push notifications.",
    steps: ["React Native / Expo", "Supabase", "Firebase", "RevenueCat", "EAS Build"],
    categories: ["mobile", "databases", "auth", "payments"],
    icon: "smartphone",
  },
  {
    slug: "developer-portfolio-stack",
    title: "The Developer Portfolio Stack",
    description:
      "Stand out with a blazing-fast portfolio site. Static generation, CMS, and custom domain.",
    steps: ["Astro / Next.js", "MDX", "Tailwind CSS", "Vercel", "Google Domains"],
    categories: ["web", "cms", "design", "hosting"],
    icon: "layout",
  },
];
