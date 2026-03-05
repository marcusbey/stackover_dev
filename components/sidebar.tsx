"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarToolItem } from "@/components/sidebar-tool-item";
import { Separator } from "@/components/ui/separator";
import { Flame, Star, TrendingUp } from "lucide-react";

export function Sidebar() {
  const hotTools = useQuery(api.tools.hot);
  const trendingTools = useQuery(api.tools.trending);

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-[49px] space-y-6 py-4">
        {/* Hot Right Now */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 px-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Hot Right Now
          </h3>
          <div className="space-y-1">
            {hotTools === undefined ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-md bg-muted animate-pulse mx-2" />
              ))
            ) : (
              hotTools.map((tool) => (
                <SidebarToolItem
                  key={tool._id}
                  name={tool.name}
                  slug={tool.slug}
                  description={tool.description}
                  type={tool.type}
                  websiteUrl={tool.websiteUrl}
                />
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Recommended */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 px-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Recommended
          </h3>
          <div className="space-y-1">
            {hotTools === undefined ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-md bg-muted animate-pulse mx-2" />
              ))
            ) : (
              hotTools.slice(0, 3).map((tool) => (
                <SidebarToolItem
                  key={tool._id}
                  name={tool.name}
                  slug={tool.slug}
                  description={tool.description}
                  type={tool.type}
                  websiteUrl={tool.websiteUrl}
                />
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Trending */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 px-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Trending
          </h3>
          <div className="space-y-1">
            {trendingTools === undefined ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-md bg-muted animate-pulse mx-2" />
              ))
            ) : (
              trendingTools.map((tool) => (
                <SidebarToolItem
                  key={tool._id}
                  name={tool.name}
                  slug={tool.slug}
                  description={tool.description}
                  type={tool.type}
                  websiteUrl={tool.websiteUrl}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
