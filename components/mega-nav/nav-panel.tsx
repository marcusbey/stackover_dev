"use client";

import Link from "next/link";
import type { NavItem } from "./nav-data";

interface NavPanelProps {
  activeKey: string | null;
  items: NavItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function NavPanel({
  activeKey,
  items,
  onMouseEnter,
  onMouseLeave,
}: NavPanelProps) {
  const activeItem = items.find((i) => i.key === activeKey && i.columns);
  const isOpen = !!activeItem;

  return (
    <div
      className="mega-nav-panel absolute left-0 right-0 top-full z-40"
      data-state={isOpen ? "open" : "closed"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mega-nav-panel-inner">
        <div className="mega-nav-content border-b bg-popover/98 shadow-lg backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            {activeItem?.columns && (
              <div
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${activeItem.columns.length}, minmax(0, 1fr))`,
                }}
              >
                {activeItem.columns.map((col, i) => (
                  <div key={i}>
                    {col.title && (
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {col.title}
                      </h3>
                    )}
                    <ul className="space-y-1">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
