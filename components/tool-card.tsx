"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/vote-button";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

interface ToolCardProps {
  tool: {
    _id: Id<"tools">;
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    type: "tool" | "saas";
    baselineScore: number;
    finalScore?: number;
    voteCount?: number;
  };
  filterNodeId?: Id<"filterNodes">;
}

export function ToolCard({ tool, filterNodeId }: ToolCardProps) {
  const score = tool.finalScore ?? tool.baselineScore;

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Logo placeholder */}
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-sm font-bold text-muted-foreground">
                {tool.name.charAt(0)}
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
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {tool.description}
                </p>
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
