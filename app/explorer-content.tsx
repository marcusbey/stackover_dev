"use client";

import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/header";

import { FilterBreadcrumb } from "@/components/filter-breadcrumb";
import { RankedList } from "@/components/ranked-list";
import { Sidebar } from "@/components/sidebar";
import { ToolCard } from "@/components/tool-card";
import { SearchDialog } from "@/components/search-dialog";
import { CATEGORY_MAP, type SearchCategory } from "@/lib/search-constants";
import { X, Search } from "lucide-react";

interface FilterNode {
  _id: Id<"filterNodes">;
  label: string;
  slug: string;
  parentId?: Id<"filterNodes">;
  domainId: Id<"domains">;
  order: number;
}

type ActiveSearch =
  | { type: "category"; category: SearchCategory }
  | { type: "query"; query: string }
  | null;

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI & Machine Learning",
  "dev-tools": "Developer Tools",
  databases: "Databases & Storage",
  web: "Web Development",
  cloud: "Cloud & Infrastructure",
  design: "Design & UI",
};

export function ExplorerContent() {
  const [activeDomainId, setActiveDomainId] = useState<Id<"domains"> | null>(
    null
  );
  const [filterPath, setFilterPath] = useState<FilterNode[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSearch, setActiveSearch] = useState<ActiveSearch>(null);

  const domains = useQuery(api.domains.list);
  const hotTools = useQuery(api.tools.hot);
  const trendingTools = useQuery(api.tools.trending);
  const featuredSections = useQuery(api.tools.featured);

  // Search results queries — only active when there's an active search
  const searchResults = useQuery(
    api.tools.search,
    activeSearch?.type === "query"
      ? { query: activeSearch.query, limit: 50 }
      : "skip"
  );
  const categoryResults = useQuery(
    api.tools.byCategory,
    activeSearch?.type === "category"
      ? { category: activeSearch.category.slug, limit: 50 }
      : "skip"
  );

  const activeDomain = domains?.find((d) => d._id === activeDomainId);

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

  const handleCategorySelect = useCallback((category: SearchCategory) => {
    setActiveSearch({ type: "category", category });
    setActiveDomainId(null);
    setFilterPath([]);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setActiveSearch({ type: "query", query });
    setActiveDomainId(null);
    setFilterPath([]);
  }, []);

  const handleClearSearch = useCallback(() => {
    setActiveSearch(null);
  }, []);

  const currentFilterNodeId =
    filterPath.length > 0
      ? filterPath[filterPath.length - 1]._id
      : undefined;

  // Determine what results to show
  const activeResults =
    activeSearch?.type === "query"
      ? searchResults
      : activeSearch?.type === "category"
        ? categoryResults
        : null;

  const isSearchActive = activeSearch !== null;

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
      />

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
            {/* Active search results view */}
            {isSearchActive ? (
              <div className="space-y-6">
                {/* Search header with clear */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h2 className="text-lg font-semibold">
                        {activeSearch.type === "category"
                          ? activeSearch.category.label
                          : `Results for "${activeSearch.query}"`}
                      </h2>
                      {activeResults && (
                        <p className="text-sm text-muted-foreground">
                          {activeResults.length} product
                          {activeResults.length !== 1 ? "s" : ""} found
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                </div>

                {/* Category badge */}
                {activeSearch.type === "category" &&
                  CATEGORY_MAP[activeSearch.category.slug] && (
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${CATEGORY_MAP[activeSearch.category.slug].color}`}
                      >
                        {CATEGORY_MAP[activeSearch.category.slug].label}
                      </span>
                    </div>
                  )}

                {/* Loading state */}
                {!activeResults && (
                  <div className="flex items-center justify-center py-16 text-muted-foreground">
                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                    <span className="text-sm">Searching...</span>
                  </div>
                )}

                {/* Empty state */}
                {activeResults && activeResults.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Search className="h-10 w-10 mb-4 opacity-30" />
                    <p className="text-sm font-medium">No products found</p>
                    <p className="text-xs mt-1">
                      Try a different search or category
                    </p>
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Search again
                    </button>
                  </div>
                )}

                {/* Results grid */}
                {activeResults && activeResults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeResults.map((tool) => (
                      <ToolCard key={tool._id} tool={tool} />
                    ))}
                  </div>
                )}
              </div>
            ) : currentFilterNodeId ? (
              <RankedList filterNodeId={currentFilterNodeId} />
            ) : (
              /* Default view: featured categories + hot/trending */
              <div className="space-y-8">
                {/* Hero search prompt */}
                <div className="text-center py-6">
                  <h1 className="text-2xl font-bold mb-2">
                    Discover 2,400+ tools & services
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    Find the right stack for what you&apos;re building
                  </p>
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border bg-muted/50 hover:bg-muted transition-colors text-muted-foreground text-sm w-full max-w-md mx-auto"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <span>What are you building?</span>
                    <kbd className="ml-auto hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                      <span className="text-xs">&#x2318;</span>K
                    </kbd>
                  </button>
                </div>

                {/* Hot + Trending row */}
                {(hotTools && hotTools.length > 0) ||
                (trendingTools && trendingTools.length > 0) ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {hotTools && hotTools.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold mb-4">
                          Hot Right Now
                        </h2>
                        <div className="space-y-4">
                          {hotTools.map((tool) => (
                            <ToolCard key={tool._id} tool={tool} />
                          ))}
                        </div>
                      </div>
                    )}
                    {trendingTools && trendingTools.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold mb-4">
                          Trending
                        </h2>
                        <div className="space-y-4">
                          {trendingTools.map((tool) => (
                            <ToolCard key={tool._id} tool={tool} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Featured category sections */}
                {featuredSections ? (
                  featuredSections.map((section) => (
                    <div key={section.category}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                          {CATEGORY_LABELS[section.category] ??
                            section.category}
                        </h2>
                        {CATEGORY_MAP[section.category] && (
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_MAP[section.category].color}`}
                          >
                            {CATEGORY_MAP[section.category].label}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.tools.map((tool) => (
                          <ToolCard key={tool._id} tool={tool} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-24 rounded-lg bg-muted animate-pulse"
                      />
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
