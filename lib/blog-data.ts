export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-react-ui-libraries-2026",
    title: "The Best React UI Libraries in 2026",
    excerpt:
      "From shadcn/ui to Radix, we compare the top component libraries for building modern React apps. Which one fits your project?",
    category: "Frontend",
    date: "2026-03-01",
    readTime: "8 min",
    author: "StackOver Team",
  },
  {
    slug: "ai-tools-every-developer-needs",
    title: "7 AI Tools Every Developer Needs in Their Workflow",
    excerpt:
      "Cursor, Copilot, v0, and more. These AI-powered tools are changing how developers write, debug, and ship code.",
    category: "AI",
    date: "2026-02-24",
    readTime: "6 min",
    author: "StackOver Team",
  },
  {
    slug: "nextjs-vs-nuxt-vs-sveltekit",
    title: "Next.js vs Nuxt vs SvelteKit: Which Framework Should You Pick?",
    excerpt:
      "A deep comparison of the three most popular full-stack frameworks. Performance, DX, ecosystem, and real-world trade-offs.",
    category: "Frameworks",
    date: "2026-02-17",
    readTime: "12 min",
    author: "StackOver Team",
  },
  {
    slug: "how-to-choose-a-database",
    title: "How to Choose the Right Database for Your App",
    excerpt:
      "PostgreSQL, MongoDB, or Supabase? When to use relational, document, or vector databases — a decision framework.",
    category: "Databases",
    date: "2026-02-10",
    readTime: "10 min",
    author: "StackOver Team",
  },
  {
    slug: "deploy-nextjs-complete-guide",
    title: "The Complete Guide to Deploying Next.js in 2026",
    excerpt:
      "Vercel, Railway, Fly.io, or self-host? We walk through every option with cost breakdowns and performance benchmarks.",
    category: "Infra",
    date: "2026-02-03",
    readTime: "15 min",
    author: "StackOver Team",
  },
  {
    slug: "building-saas-from-scratch",
    title: "Building a SaaS from Scratch: The Complete Stack Guide",
    excerpt:
      "From auth to payments to deployment — the exact tools and libraries you need to ship a production SaaS in 2026.",
    category: "Guides",
    date: "2026-01-27",
    readTime: "20 min",
    author: "StackOver Team",
  },
];
