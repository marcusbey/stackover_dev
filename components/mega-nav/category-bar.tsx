"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { buildCategoryColumns } from "./nav-data";

/** Map group title → first category slug for the "hot tools" query */
const GROUP_PRIMARY_SLUG: Record<string, string> = {
  Build: "web",
  Data: "databases",
  AI: "ai",
  Infra: "cloud",
  Growth: "marketing",
  Connect: "communication",
  Design: "design",
};

const columns = buildCategoryColumns();
const STORAGE_KEY = "categories-active-group";

export function CategoryBar() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && columns.some((c) => c.title === stored)) {
      setActiveGroup(stored);
    }
    setMounted(true);
  }, []);

  const toggle = (groupTitle: string) => {
    const next = activeGroup === groupTitle ? null : groupTitle;
    setActiveGroup(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, next);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Avoid hydration mismatch — render closed by default on server
  const currentGroup = mounted ? activeGroup : null;
  const activeColumn = currentGroup
    ? columns.find((c) => c.title === currentGroup)
    : null;
  const primarySlug = currentGroup
    ? GROUP_PRIMARY_SLUG[currentGroup] ?? null
    : null;

  return (
    <div className="hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container mx-auto px-4 py-3">
        {/* Group buttons row — Vercel-card style */}
        <div className="flex items-stretch gap-3 overflow-x-auto">
          {columns.map((col) => (
            <button
              key={col.title}
              onClick={() => col.title && toggle(col.title)}
              className={`group flex flex-1 items-center justify-between gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                currentGroup === col.title
                  ? "border-foreground/15 bg-foreground text-background shadow-sm"
                  : "border-border/60 bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-border hover:shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
              }`}
            >
              {col.title}
              <ChevronDown
                className={`h-3.5 w-3.5 opacity-40 transition-transform ${
                  currentGroup === col.title ? "rotate-180 opacity-70" : "group-hover:opacity-70"
                }`}
              />
            </button>
          ))}
        </div>

      </div>

      {/* Group-focused expanded panel */}
      <div
        className="mega-nav-panel"
        data-state={currentGroup ? "open" : "closed"}
      >
        <div className="mega-nav-panel-inner">
          <div className="container mx-auto px-4 py-4">
            <div className="mega-nav-content flex gap-8">
              {/* Left: category links */}
              {activeColumn && (
                <div className="flex-1 min-w-0">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {activeColumn.title}
                  </h3>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                    {activeColumn.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group -mx-2 block rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
                        >
                          <span className="text-sm font-medium text-foreground">
                            {link.label}
                          </span>
                          {link.description && (
                            <p className="text-xs text-muted-foreground">
                              {link.description}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Right: hot tools for this group */}
              {primarySlug && (
                <HotToolsPanel
                  groupTitle={currentGroup!}
                  categorySlug={primarySlug}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotToolsPanel({
  groupTitle,
  categorySlug,
}: {
  groupTitle: string;
  categorySlug: string;
}) {
  const tools = useQuery(api.tools.byCategory, {
    category: categorySlug,
    limit: 4,
  });

  return (
    <div className="w-64 flex-shrink-0 rounded-lg border bg-muted/30 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Hot in {groupTitle}
      </h4>
      {!tools ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : tools.length === 0 ? (
        <p className="text-xs text-muted-foreground">No tools yet</p>
      ) : (
        <ul className="space-y-2">
          {tools.map((tool) => (
            <li key={tool._id}>
              <Link
                href={`/tools/${tool.slug}`}
                className="block rounded-md p-2 transition-colors hover:bg-accent"
              >
                <span className="text-sm font-medium text-foreground">
                  {tool.name}
                </span>
                {tool.description && (
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
