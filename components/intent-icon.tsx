"use client";

import {
  Rocket,
  Sparkles,
  Database,
  Smartphone,
  Cloud,
  CreditCard,
  Lock,
  Layout,
  BarChart3,
  Server,
  Mail,
  Zap,
  MessageSquare,
  Image,
  GitBranch,
  ShoppingCart,
  FileText,
  Activity,
  LayoutDashboard,
  Search,
  Users,
  Palette,
  Video,
  Headphones,
  Handshake,
  Megaphone,
  Blocks,
  Shield,
  Share2,
  Briefcase,
  Bot,
  Code,
  Component,
  PenTool,
  Layers,
  Globe,
  type LucideProps,
} from "lucide-react";
import { type ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  rocket: Rocket,
  sparkles: Sparkles,
  database: Database,
  smartphone: Smartphone,
  cloud: Cloud,
  "credit-card": CreditCard,
  lock: Lock,
  layout: Layout,
  "bar-chart-3": BarChart3,
  server: Server,
  mail: Mail,
  zap: Zap,
  "message-square": MessageSquare,
  image: Image,
  "git-branch": GitBranch,
  "shopping-cart": ShoppingCart,
  "file-text": FileText,
  activity: Activity,
  "layout-dashboard": LayoutDashboard,
  search: Search,
  users: Users,
  palette: Palette,
  video: Video,
  headphones: Headphones,
  handshake: Handshake,
  megaphone: Megaphone,
  blocks: Blocks,
  shield: Shield,
  "share-2": Share2,
  briefcase: Briefcase,
  bot: Bot,
  code: Code,
  component: Component,
  "pen-tool": PenTool,
  layers: Layers,
  globe: Globe,
  "globe-2": Globe,
  brain: Sparkles,
  wrench: PenTool,
};

interface IntentIconProps extends LucideProps {
  name: string;
}

export function IntentIcon({ name, ...props }: IntentIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <Search {...props} />;
  return <Icon {...props} />;
}
