"use client";

import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/header";
import { DomainPills } from "@/components/domain-pills";
import { FilterBreadcrumb } from "@/components/filter-breadcrumb";
import { RankedList } from "@/components/ranked-list";
import { Sidebar } from "@/components/sidebar";
import { ToolCard } from "@/components/tool-card";

interface FilterNode {
  _id: Id<"filterNodes">;
  label: string;
  slug: string;
  parentId?: Id<"filterNodes">;
  domainId: Id<"domains">;
  order: number;
}

export function ExplorerContent() {
  const [activeDomainId, setActiveDomainId] = useState<Id<"domains"> | null>(null);
  const [filterPath, setFilterPath] = useState<FilterNode[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const domains = useQuery(api.domains.list);
  const hotTools = useQuery(api.tools.hot);
  const trendingTools = useQuery(api.tools.trending);

  const activeDomain = domains?.find((d) => d._id === activeDomainId);

  const handleDomainSelect = useCallback((domainId: Id<"domains"> | null) => {
    setActiveDomainId(domainId);
    setFilterPath([]);
  }, []);

  const handleFilterSelect = useCallback((node: FilterNode) => {
    setFilterPath((prev) => [...prev, node]);
  }, []);

  const handleNavigateTo = useCallback((index: number) => {
    if (index === -1) {
      setFilterPath([]);
    } else {
      setFilterPath((prev) => prev.slice(0, index + 1));
    }
  }, []);

  const currentFilterNodeId = filterPath.length > 0
    ? filterPath[filterPath.length - 1]._id
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <DomainPills activeDomainId={activeDomainId} onSelect={handleDomainSelect} />

      {activeDomainId && activeDomain && (
        <FilterBreadcrumb
          domainId={activeDomainId}
          domainName={activeDomain.name}
          filterPath={filterPath}
          onSelectFilter={handleFilterSelect}
          onNavigateTo={handleNavigateTo}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {currentFilterNodeId ? (
              <RankedList filterNodeId={currentFilterNodeId} />
            ) : (
              /* Default view: show featured tools */
              <div className="space-y-8">
                {hotTools && hotTools.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Hot Right Now</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {hotTools.map((tool) => (
                        <ToolCard key={tool._id} tool={tool} />
                      ))}
                    </div>
                  </div>
                )}
                {trendingTools && trendingTools.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Trending</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trendingTools.map((tool) => (
                        <ToolCard key={tool._id} tool={tool} />
                      ))}
                    </div>
                  </div>
                )}
                {!hotTools && !trendingTools && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
