export interface StackLayerConfig {
  key: string;
  title: string;
  icon: string;
  description: string;
  whyItMatters: string;
  categories: string[];
  tagFilter?: string;
  allowMultiple: boolean;
  optional: boolean;
}

export const STACK_LAYERS: StackLayerConfig[] = [
  {
    key: "domain",
    title: "Domain Name",
    icon: "globe-2",
    description:
      "Your website address — the first thing people type to find you online.",
    whyItMatters:
      "A good domain name builds trust and makes your brand memorable. Most providers cost $10–15/year.",
    categories: ["domains"],
    allowMultiple: false,
    optional: true,
  },
  {
    key: "hosting",
    title: "Hosting & Deployment",
    icon: "server",
    description:
      "Where your app lives on the internet. This service keeps it running 24/7.",
    whyItMatters:
      "Hosting determines how fast your site loads and how reliable it is. Modern platforms handle scaling automatically.",
    categories: ["hosting", "cloud"],
    allowMultiple: false,
    optional: false,
  },
  {
    key: "frontend",
    title: "Frontend Framework",
    icon: "layout",
    description:
      "The toolkit that builds what users see and click on — buttons, pages, animations.",
    whyItMatters:
      "Your frontend framework shapes developer speed and user experience. Pick one that matches your team's skills.",
    categories: ["web"],
    tagFilter: "frontend",
    allowMultiple: false,
    optional: false,
  },
  {
    key: "backend",
    title: "Backend / API",
    icon: "server",
    description:
      "The behind-the-scenes engine that processes data, handles logic, and talks to your database.",
    whyItMatters:
      "A solid backend keeps your app secure and fast. Many modern frameworks combine frontend and backend in one.",
    categories: ["web", "dev-tools"],
    tagFilter: "backend",
    allowMultiple: false,
    optional: true,
  },
  {
    key: "database",
    title: "Database",
    icon: "database",
    description:
      "Where all your app's data is stored — user accounts, posts, orders, everything.",
    whyItMatters:
      "The right database makes your app fast and your data safe. Some are better for simple apps, others for complex ones.",
    categories: ["databases"],
    allowMultiple: true,
    optional: false,
  },
  {
    key: "auth",
    title: "Authentication",
    icon: "shield",
    description:
      "Handles sign-up, login, and keeping user accounts secure.",
    whyItMatters:
      "Don't build auth from scratch — it's complex and security-critical. These tools handle passwords, OAuth, and sessions for you.",
    categories: ["auth"],
    allowMultiple: false,
    optional: true,
  },
  {
    key: "payments",
    title: "Payments & Billing",
    icon: "credit-card",
    description:
      "Accept credit cards, manage subscriptions, and handle invoices.",
    whyItMatters:
      "If you're charging users, you need a payment processor. They handle PCI compliance so you don't have to.",
    categories: ["payments"],
    allowMultiple: true,
    optional: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    icon: "bar-chart-3",
    description:
      "Track how people use your app — page views, clicks, conversions, and more.",
    whyItMatters:
      "You can't improve what you don't measure. Analytics help you understand your users and grow faster.",
    categories: ["analytics"],
    allowMultiple: true,
    optional: true,
  },
  {
    key: "email",
    title: "Email & Notifications",
    icon: "mail",
    description:
      "Send transactional emails (receipts, password resets) and marketing campaigns.",
    whyItMatters:
      "Email is still the #1 way to reach users. A good email service ensures your messages actually arrive in inboxes.",
    categories: ["communication"],
    allowMultiple: true,
    optional: true,
  },
  {
    key: "monitoring",
    title: "Monitoring & Logging",
    icon: "activity",
    description:
      "Watch your app's health in real time — catch errors and slow pages before users complain.",
    whyItMatters:
      "When something breaks at 2 AM, monitoring tools alert you instantly and help you find the cause fast.",
    categories: ["monitoring"],
    allowMultiple: true,
    optional: true,
  },
  {
    key: "cicd",
    title: "CI/CD & DevOps",
    icon: "git-branch",
    description:
      "Automatically test and deploy your code whenever you push changes.",
    whyItMatters:
      "CI/CD catches bugs before they reach production and makes deploying new features effortless.",
    categories: ["dev-tools"],
    tagFilter: "ci-cd",
    allowMultiple: true,
    optional: true,
  },
  {
    key: "cms",
    title: "Content Management",
    icon: "file-text",
    description:
      "A system for creating and managing website content — blog posts, landing pages, docs.",
    whyItMatters:
      "A CMS lets non-developers update content without touching code. Great for blogs, docs, and marketing pages.",
    categories: ["cms"],
    allowMultiple: false,
    optional: true,
  },
];
