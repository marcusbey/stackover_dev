"use client";

import Link from "next/link";
import { buildCategoryColumns } from "./nav-data";

const columns = buildCategoryColumns();

export function CategoryBar() {
  return (
    <div className="hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container mx-auto px-4 py-4">
        <div
          className="grid gap-6"
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
      </div>
    </div>
  );
}
