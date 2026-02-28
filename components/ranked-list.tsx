"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ToolCard } from "@/components/tool-card";
import { Id } from "@/convex/_generated/dataModel";

interface RankedListProps {
  filterNodeId: Id<"filterNodes">;
  sectionTitle?: string;
}

export function RankedList({ filterNodeId, sectionTitle = "Top Rated" }: RankedListProps) {
  const tools = useQuery(api.tools.byFilter, { filterNodeId });

  if (tools === undefined) {
    // Loading state - skeleton cards
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">{sectionTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No tools found for this category yet.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{sectionTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool!._id}
            tool={tool!}
            filterNodeId={filterNodeId}
          />
        ))}
      </div>
    </div>
  );
}
