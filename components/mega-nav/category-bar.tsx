"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { buildCategoryColumns } from "./nav-data";

const columns = buildCategoryColumns();
const STORAGE_KEY = "categories-collapsed";

export function CategoryBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  // Avoid hydration mismatch — render expanded by default on server
  const isCollapsed = mounted ? collapsed : false;

  return (
    <div className="hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      {/* Collapsed pill row */}
      {isCollapsed && (
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            {columns.map((col) => (
              <button
                key={col.title}
                onClick={toggle}
                className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {col.title}
              </button>
            ))}
            <button
              onClick={toggle}
              className="ml-auto p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Expand categories"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Expanded full grid */}
      <div
        className="mega-nav-panel"
        data-state={isCollapsed ? "closed" : "open"}
      >
        <div className="mega-nav-panel-inner">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div
                className="mega-nav-content flex-1 grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                }}
              >
                {columns.map((col, i) => (
                  <div key={i}>
                    {col.title && (
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {col.title}
                      </h3>
                    )}
                    <ul className="space-y-0.5">
                      {col.links.map((link) => (
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
                ))}
              </div>
              <button
                onClick={toggle}
                className="mt-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0"
                aria-label="Collapse categories"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
