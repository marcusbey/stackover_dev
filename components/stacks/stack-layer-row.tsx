"use client";

import Image from "next/image";
import Link from "next/link";
import { getLogoUrl } from "@/lib/logos";
import { useState } from "react";
import { STACK_LAYERS } from "@/lib/stack-layers";
import { AlivenessBadge } from "@/components/aliveness-badge";
import {
  Globe2,
  Server,
  Layout,
  Database,
  Shield,
  CreditCard,
  BarChart3,
  Mail,
  Activity,
  GitBranch,
  FileText,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "globe-2": Globe2,
  server: Server,
  layout: Layout,
  database: Database,
  shield: Shield,
  "credit-card": CreditCard,
  "bar-chart-3": BarChart3,
  mail: Mail,
  activity: Activity,
  "git-branch": GitBranch,
  "file-text": FileText,
};

interface StackLayerRowProps {
  layerKey: string;
  tools: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    websiteUrl: string;
    alivenessScore?: number;
  }[];
  isLast: boolean;
}

export function StackLayerRow({ layerKey, tools, isLast }: StackLayerRowProps) {
  const layerConfig = STACK_LAYERS.find((l) => l.key === layerKey);
  if (!layerConfig) return null;

  const IconComponent = ICON_MAP[layerConfig.icon] ?? Globe2;

  return (
    <div className="relative">
      <div className="flex gap-4 sm:gap-6">
        {/* Left: icon + connector */}
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          {!isLast && (
            <div className="w-px flex-1 bg-border min-h-[24px]" />
          )}
        </div>

        {/* Right: layer content */}
        <div className="flex-1 pb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            {layerConfig.title}
          </h3>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool) => (
              <ToolChip key={tool._id} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolChip({
  tool,
}: {
  tool: { name: string; slug: string; description: string; websiteUrl: string; alivenessScore?: number };
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex items-center gap-3 bg-card border rounded-lg px-4 py-3 hover:shadow-sm transition-shadow max-w-sm"
    >
      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
        {imgError ? (
          <span className="text-xs font-bold text-muted-foreground">
            {tool.name.charAt(0)}
          </span>
        ) : (
          <Image
            src={getLogoUrl(tool.websiteUrl)}
            alt={tool.name}
            width={32}
            height={32}
            className="rounded-md object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{tool.name}</p>
        {tool.alivenessScore !== undefined && (
          <AlivenessBadge score={tool.alivenessScore} className="mt-0.5" />
        )}
        <p className="text-xs text-muted-foreground line-clamp-1">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
