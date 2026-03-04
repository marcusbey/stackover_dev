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
  const cats = SEARCH_CATEGORIES;
  const colSize = Math.ceil(cats.length / 3);
  return [
    {
      links: cats
        .slice(0, colSize)
        .map((c) => ({ label: c.label, href: `/categories/${c.slug}` })),
    },
    {
      links: cats
        .slice(colSize, colSize * 2)
        .map((c) => ({ label: c.label, href: `/categories/${c.slug}` })),
    },
    {
      links: cats
        .slice(colSize * 2)
        .map((c) => ({ label: c.label, href: `/categories/${c.slug}` })),
    },
  ];
}
