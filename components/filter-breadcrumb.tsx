"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface FilterNode {
  _id: Id<"filterNodes">;
  label: string;
  slug: string;
  parentId?: Id<"filterNodes">;
  domainId: Id<"domains">;
  order: number;
}

interface FilterBreadcrumbProps {
  domainId: Id<"domains">;
  domainName: string;
  filterPath: FilterNode[];
  onSelectFilter: (node: FilterNode) => void;
  onNavigateTo: (index: number) => void;
}

export function FilterBreadcrumb({
  domainId,
  domainName,
  filterPath,
  onSelectFilter,
  onNavigateTo,
}: FilterBreadcrumbProps) {
  const currentNodeId = filterPath.length > 0 ? filterPath[filterPath.length - 1]._id : undefined;

  // Get root-level filter nodes for this domain (no parent)
  const allNodes = useQuery(api.filterNodes.byDomain, { domainId });
  const childNodes = useQuery(
    api.filterNodes.children,
    currentNodeId ? { parentId: currentNodeId } : "skip"
  );

  // If we're at root level (no filter selected), show root nodes
  // If we have a current node, show its children
  const rootNodes = allNodes?.filter((n) => !n.parentId) ?? [];
  const availableFilters = currentNodeId ? (childNodes ?? []) : rootNodes;

  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-2">
        {/* Breadcrumb path */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <button
            className="hover:text-foreground transition-colors"
            onClick={() => onNavigateTo(-1)}
          >
            {domainName}
          </button>
          {filterPath.map((node, index) => (
            <span key={node._id} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              <button
                className="hover:text-foreground transition-colors"
                onClick={() => onNavigateTo(index)}
              >
                {node.label}
              </button>
            </span>
          ))}
        </div>

        {/* Sub-filter chips */}
        {availableFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableFilters
              .sort((a, b) => a.order - b.order)
              .map((node) => (
                <Badge
                  key={node._id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors px-3 py-1"
                  onClick={() => onSelectFilter(node as FilterNode)}
                >
                  {node.label}
                </Badge>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
