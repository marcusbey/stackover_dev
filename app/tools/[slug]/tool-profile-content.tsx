"use client";

import { usePreloadedQuery, useQuery } from "convex/react";
import type { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ActivitySparkline } from "@/components/activity-sparkline";
import { AlivenessBadge } from "@/components/aliveness-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getLogoUrl } from "@/lib/logos";

interface ToolProfileContentProps {
  preloadedTool: Preloaded<typeof api.tools.bySlug>;
}

export function ToolProfileContent({ preloadedTool }: ToolProfileContentProps) {
  const tool = usePreloadedQuery(preloadedTool);

  if (tool === null) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explorer
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explorer
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
          <Image
            src={getLogoUrl(tool.websiteUrl)}
            alt={tool.name}
            width={48}
            height={48}
            className="rounded-lg object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src !== tool.logoUrl) {
                img.src = tool.logoUrl;
              } else {
                img.style.display = "none";
              }
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{tool.name}</h1>
            <Badge variant="secondary" className="text-sm">
              {tool.baselineScore.toFixed(1)}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {tool.type}
            </Badge>
          </div>
          <p className="text-muted-foreground">{tool.description}</p>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tool.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <a
        href={tool.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mb-8"
      >
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Website
        </Button>
      </a>

      <Separator className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-green-600 mb-3">Pros</h3>
            <ul className="space-y-2">
              {tool.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-red-600 mb-3">Cons</h3>
            <ul className="space-y-2">
              {tool.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {tool.alivenessScore !== undefined && (
        <>
          <Separator className="my-8" />
          <ActivitySection toolId={tool._id} tool={tool} />
        </>
      )}

      <div className="flex gap-2 mt-6">
        {tool.isHot && <Badge variant="destructive">Hot</Badge>}
        {tool.isTrending && (
          <Badge className="bg-green-600">Trending</Badge>
        )}
      </div>
    </div>
  );
}

function ActivitySection({
  toolId,
  tool,
}: {
  toolId: typeof api.tools.activityForTool._args.toolId;
  tool: {
    alivenessScore?: number;
    lastRelease?: string;
    lastReleaseDate?: number;
    stars?: number;
    openIssues?: number;
  };
}) {
  const activity = useQuery(api.tools.activityForTool, { toolId });
  const weeklyData = activity?.map((r) => r.commits) ?? [];

  const daysSinceRelease = tool.lastReleaseDate
    ? Math.round((Date.now() - tool.lastReleaseDate) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <AlivenessBadge score={tool.alivenessScore} />
      </div>

      {weeklyData.length > 0 && (
        <div className="mb-4">
          <ActivitySparkline
            data={weeklyData}
            alivenessScore={tool.alivenessScore}
            height={48}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            {weeklyData.length}-week commit activity
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tool.lastRelease && (
          <div>
            <p className="text-xs text-muted-foreground">Latest Release</p>
            <p className="text-sm font-medium">{tool.lastRelease}</p>
            {daysSinceRelease !== null && (
              <p className="text-[11px] text-muted-foreground">
                {daysSinceRelease === 0 ? "Today" : `${daysSinceRelease}d ago`}
              </p>
            )}
          </div>
        )}
        {tool.stars !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Stars</p>
            <p className="text-sm font-medium">
              {tool.stars >= 1000 ? `${(tool.stars / 1000).toFixed(1)}k` : tool.stars}
            </p>
          </div>
        )}
        {tool.openIssues !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Open Issues</p>
            <p className="text-sm font-medium">{tool.openIssues}</p>
          </div>
        )}
        {weeklyData.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Commits/Week</p>
            <p className="text-sm font-medium">
              {Math.round(weeklyData.slice(-4).reduce((a: number, b: number) => a + b, 0) / Math.min(4, weeklyData.length))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
