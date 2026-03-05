"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/vote-button";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import Image from "next/image";
import { getLogoUrl } from "@/lib/logos";
import { useState } from "react";
import { ActivitySparkline } from "@/components/activity-sparkline";
import { AlivenessBadge } from "@/components/aliveness-badge";

interface ToolCardProps {
  tool: {
    _id: Id<"tools">;
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
    type: "tool" | "saas";
    baselineScore: number;
    finalScore?: number;
    voteCount?: number;
    tags?: string[];
    alivenessScore?: number;
    activityData?: number[];
  };
  filterNodeId?: Id<"filterNodes">;
}

export function ToolCard({ tool, filterNodeId }: ToolCardProps) {
  const score = tool.finalScore ?? tool.baselineScore;
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                {imgError ? (
                  <span className="text-sm font-bold text-muted-foreground">
                    {tool.name.charAt(0)}
                  </span>
                ) : (
                  <Image
                    src={getLogoUrl(tool.websiteUrl)}
                    alt={tool.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-contain"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {score.toFixed(1)}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {tool.type}
                  </Badge>
                  <AlivenessBadge score={tool.alivenessScore} showLabel={false} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {tool.description}
                </p>
                {tool.tags && tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tool.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {tool.activityData && tool.activityData.length > 0 && (
                  <div className="mt-2">
                    <ActivitySparkline
                      data={tool.activityData}
                      alivenessScore={tool.alivenessScore}
                      height={20}
                    />
                  </div>
                )}
              </div>
            </div>

            {filterNodeId && (
              <VoteButton
                toolId={tool._id}
                filterNodeId={filterNodeId}
                voteCount={tool.voteCount ?? 0}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
