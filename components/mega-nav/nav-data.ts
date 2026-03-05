import { SEARCH_CATEGORIES } from "@/lib/search-constants";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavColumn {
  title?: string;
  links: NavLink[];
}

export interface NavItem {
  key: string;
  label: string;
  href?: string;
  columns?: NavColumn[];
}

/** Short descriptions for each category slug */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  web: "Frameworks, libraries & full-stack tools",
  mobile: "iOS, Android & cross-platform SDKs",
  nocode: "Build apps without writing code",
  design: "UI kits, prototyping & design systems",
  cms: "Manage content, blogs & docs",
  ai: "LLMs, ML models & AI APIs",
  databases: "SQL, NoSQL & real-time datastores",
  analytics: "Track usage, events & conversions",
  search: "Full-text & vector search engines",
  cloud: "Cloud platforms & infrastructure",
  "dev-tools": "IDEs, CLIs & developer utilities",
  auth: "Login, OAuth & access control",
  monitoring: "Observability, logs & alerting",
  hosting: "Deploy, serve & scale your app",
  domains: "Register & manage domain names",
  marketing: "Email campaigns, SEO & ads",
  sales: "CRM, pipelines & lead management",
  ecommerce: "Storefronts, carts & checkout",
  payments: "Billing, subscriptions & invoices",
  hr: "Hiring, payroll & team management",
  communication: "Email, SMS & push notifications",
  collaboration: "Team chat, docs & project tools",
  support: "Help desks, ticketing & live chat",
  social: "Activity feeds & social features",
  automation: "Workflows, bots & integrations",
  education: "Courses, LMS & learning platforms",
  video: "Streaming, editing & media APIs",
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "explore",
    label: "Explore",
    columns: [
      {
        title: "Discover",
        links: [
          {
            label: "Hot Right Now",
            href: "/",
            description: "Trending tools this week",
          },
          {
            label: "New Arrivals",
            href: "/",
            description: "Recently added tools",
          },
          {
            label: "Top Rated",
            href: "/",
            description: "Highest-scored by community",
          },
        ],
      },
      {
        title: "By Intent",
        links: [
          {
            label: "Build a SaaS",
            href: "/",
            description: "Frameworks & full-stack tools",
          },
          {
            label: "Add AI to My App",
            href: "/",
            description: "LLMs, APIs & integrations",
          },
          {
            label: "Deploy & Host",
            href: "/",
            description: "Cloud, CDN & containers",
          },
          {
            label: "Accept Payments",
            href: "/",
            description: "Billing & payment processing",
          },
        ],
      },
      {
        title: "Compare",
        links: [
          {
            label: "Alternatives",
            href: "/",
            description: "Find replacements for any tool",
          },
          {
            label: "Head-to-Head",
            href: "/",
            description: "Side-by-side comparisons",
          },
        ],
      },
      {
        title: "Build",
        links: [
          {
            label: "Stack Builder",
            href: "/stacks/new",
            description: "Build your tech stack step by step",
          },
          {
            label: "Company Stacks",
            href: "/stacks",
            description: "See what top companies use",
          },
        ],
      },
    ],
  },
  {
    key: "categories",
    label: "Categories",
    columns: buildCategoryColumns(),
  },
  {
    key: "resources",
    label: "Resources",
    columns: [
      {
        title: "Learn",
        links: [
          {
            label: "Blog",
            href: "/blog",
            description: "Guides and insights",
          },
          {
            label: "Stack Guides",
            href: "/guides",
            description: "Curated tool combinations",
          },
        ],
      },
      {
        title: "Community",
        links: [
          {
            label: "Submit a Tool",
            href: "/submit",
            description: "Add your product",
          },
          {
            label: "GitHub",
            href: "https://github.com/marcusbey/stackover_dev",
            description: "Open source",
          },
        ],
      },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    href: "/pricing",
  },
];

function buildCategoryColumns(): NavColumn[] {
  const groups: { title: string; slugs: string[] }[] = [
    { title: "Build", slugs: ["web", "mobile", "nocode", "design", "cms"] },
    { title: "Data & AI", slugs: ["ai", "databases", "analytics", "search"] },
    { title: "Infra", slugs: ["cloud", "dev-tools", "auth", "monitoring", "hosting", "domains"] },
    { title: "Growth", slugs: ["marketing", "sales", "ecommerce", "payments", "hr"] },
    { title: "Connect", slugs: ["communication", "collaboration", "support", "social", "automation", "education", "video"] },
  ];

  return groups.map((group) => ({
    title: group.title,
    links: group.slugs
      .map((slug) => {
        const cat = SEARCH_CATEGORIES.find((c) => c.slug === slug);
        if (!cat) return null;
        return {
          label: cat.label,
          href: `/categories/${slug}`,
          description: CATEGORY_DESCRIPTIONS[slug],
        };
      })
      .filter(Boolean) as NavLink[],
  }));
}
