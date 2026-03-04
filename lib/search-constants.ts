export interface SearchCategory {
  slug: string;
  label: string;
  icon: string;
  color: string;
}

export interface SearchIntent {
  label: string;
  query: string;
  category: string;
  icon: string;
}

export const SEARCH_CATEGORIES: SearchCategory[] = [
  { slug: "ai", label: "AI & ML", icon: "brain", color: "bg-purple-100 text-purple-700" },
  { slug: "dev-tools", label: "Developer Tools", icon: "wrench", color: "bg-blue-100 text-blue-700" },
  { slug: "databases", label: "Databases", icon: "database", color: "bg-green-100 text-green-700" },
  { slug: "cloud", label: "Cloud & Infra", icon: "cloud", color: "bg-sky-100 text-sky-700" },
  { slug: "web", label: "Web Dev", icon: "globe", color: "bg-indigo-100 text-indigo-700" },
  { slug: "mobile", label: "Mobile", icon: "smartphone", color: "bg-pink-100 text-pink-700" },
  { slug: "design", label: "Design", icon: "palette", color: "bg-rose-100 text-rose-700" },
  { slug: "video", label: "Video & Media", icon: "video", color: "bg-red-100 text-red-700" },
  { slug: "nocode", label: "No-Code", icon: "blocks", color: "bg-amber-100 text-amber-700" },
  { slug: "analytics", label: "Analytics", icon: "bar-chart-3", color: "bg-emerald-100 text-emerald-700" },
  { slug: "marketing", label: "Marketing", icon: "megaphone", color: "bg-orange-100 text-orange-700" },
  { slug: "sales", label: "Sales & CRM", icon: "handshake", color: "bg-cyan-100 text-cyan-700" },
  { slug: "support", label: "Support", icon: "headphones", color: "bg-violet-100 text-violet-700" },
  { slug: "collaboration", label: "Collaboration", icon: "users", color: "bg-teal-100 text-teal-700" },
  { slug: "auth", label: "Auth & Security", icon: "shield", color: "bg-slate-100 text-slate-700" },
  { slug: "payments", label: "Payments", icon: "credit-card", color: "bg-lime-100 text-lime-700" },
  { slug: "ecommerce", label: "E-Commerce", icon: "shopping-cart", color: "bg-fuchsia-100 text-fuchsia-700" },
  { slug: "communication", label: "Communication", icon: "message-circle", color: "bg-blue-100 text-blue-700" },
  { slug: "cms", label: "CMS", icon: "file-text", color: "bg-stone-100 text-stone-700" },
  { slug: "hr", label: "HR & Recruiting", icon: "briefcase", color: "bg-yellow-100 text-yellow-700" },
  { slug: "education", label: "Education", icon: "graduation-cap", color: "bg-indigo-100 text-indigo-700" },
  { slug: "social", label: "Social", icon: "share-2", color: "bg-pink-100 text-pink-700" },
  { slug: "automation", label: "Automation", icon: "zap", color: "bg-amber-100 text-amber-700" },
  { slug: "search", label: "Search", icon: "search", color: "bg-gray-100 text-gray-700" },
  { slug: "monitoring", label: "Monitoring", icon: "activity", color: "bg-red-100 text-red-700" },
];

export const SEARCH_INTENTS: SearchIntent[] = [
  { label: "Build a SaaS app", query: "saas framework fullstack", category: "web", icon: "rocket" },
  { label: "Add AI to my app", query: "ai api llm integration", category: "ai", icon: "sparkles" },
  { label: "Set up a database", query: "database postgres sql", category: "databases", icon: "database" },
  { label: "Build a mobile app", query: "mobile app react native flutter", category: "mobile", icon: "smartphone" },
  { label: "Deploy to the cloud", query: "cloud hosting deploy", category: "cloud", icon: "cloud" },
  { label: "Accept payments", query: "payments stripe billing", category: "payments", icon: "credit-card" },
  { label: "Add authentication", query: "auth login oauth", category: "auth", icon: "lock" },
  { label: "Create a landing page", query: "landing page builder website", category: "nocode", icon: "layout" },
  { label: "Set up analytics", query: "analytics tracking events", category: "analytics", icon: "bar-chart-3" },
  { label: "Build an API", query: "api rest graphql backend", category: "web", icon: "server" },
  { label: "Send emails & notifications", query: "email transactional notifications", category: "communication", icon: "mail" },
  { label: "Automate workflows", query: "automation workflow integration", category: "automation", icon: "zap" },
  { label: "Build a chatbot", query: "chatbot ai conversational", category: "ai", icon: "message-square" },
  { label: "Generate images with AI", query: "image generation ai art", category: "ai", icon: "image" },
  { label: "Set up CI/CD", query: "ci cd pipeline devops", category: "dev-tools", icon: "git-branch" },
  { label: "Build an e-commerce store", query: "ecommerce shop store", category: "ecommerce", icon: "shopping-cart" },
  { label: "Create a blog or CMS", query: "cms blog content management", category: "cms", icon: "file-text" },
  { label: "Monitor my app", query: "monitoring observability logging", category: "monitoring", icon: "activity" },
  { label: "Build a dashboard", query: "dashboard charts data visualization", category: "analytics", icon: "layout-dashboard" },
  { label: "Search my data", query: "search engine full text", category: "search", icon: "search" },
  { label: "Collaborate with my team", query: "collaboration project management", category: "collaboration", icon: "users" },
  { label: "Design UI components", query: "design system ui components", category: "design", icon: "palette" },
  { label: "Build a video app", query: "video streaming media", category: "video", icon: "video" },
  { label: "Set up customer support", query: "support helpdesk ticketing", category: "support", icon: "headphones" },
  { label: "Manage a CRM", query: "crm sales pipeline contacts", category: "sales", icon: "handshake" },
  { label: "Run marketing campaigns", query: "marketing email campaign", category: "marketing", icon: "megaphone" },
  { label: "Build without code", query: "nocode low-code builder", category: "nocode", icon: "blocks" },
  { label: "Secure my app", query: "security vulnerability scanning", category: "auth", icon: "shield" },
  { label: "Create social features", query: "social feed activity stream", category: "social", icon: "share-2" },
  { label: "Hire & manage talent", query: "hr recruiting hiring", category: "hr", icon: "briefcase" },
];

export const CATEGORY_MAP = Object.fromEntries(
  SEARCH_CATEGORIES.map((c) => [c.slug, c])
);
