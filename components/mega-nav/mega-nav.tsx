"use client";

import Link from "next/link";
import { Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCategoryColumns } from "./nav-data";
import { useMegaNav } from "./use-mega-nav";
import { MobileNav } from "./mobile-nav";

const CATEGORY_TABS = buildCategoryColumns();

interface MegaNavProps {
  onSearchOpen: () => void;
}

export function MegaNav({ onSearchOpen }: MegaNavProps) {
  const { activeKey, open, close, scheduleClose, cancelClose, toggle } =
    useMegaNav();

  const activeTab = CATEGORY_TABS.find((t) => t.title === activeKey);

  return (
    <nav
      className="sticky top-0 z-50"
      onMouseLeave={scheduleClose}
    >
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-12 items-center gap-6 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold shrink-0"
          >
            <Layers className="h-4 w-4" />
            stackover.dev
          </Link>

          {/* Category tabs (desktop) */}
          <div className="hidden items-center gap-1 md:flex flex-1 justify-center">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.title}
                className="mega-nav-trigger relative px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                data-state={activeKey === tab.title ? "open" : "closed"}
                onMouseEnter={() => open(tab.title!)}
                onClick={() => toggle(tab.title!)}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Right: Search + Auth + Mobile */}
          <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
            <Button
              variant="ghost"
              size="sm"
              className="hidden items-center gap-2 text-muted-foreground sm:inline-flex"
              onClick={onSearchOpen}
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">Search</span>
              <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                <span className="text-xs">&#x2318;</span>K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={onSearchOpen}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Link href="/auth/sign-in" className="hidden sm:block">
              <Button variant="default" size="sm" className="text-xs h-7">
                Sign in
              </Button>
            </Link>
            <MobileNav onSearchOpen={onSearchOpen} />
          </div>
        </div>
      </div>

      {/* Dropdown panel */}
      <div
        className="mega-nav-panel absolute left-0 right-0 top-full z-40"
        data-state={activeTab ? "open" : "closed"}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div className="mega-nav-panel-inner">
          <div className="mega-nav-content border-b bg-popover/98 shadow-lg backdrop-blur-xl">
            {activeTab && (
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-wrap gap-x-8 gap-y-1">
                  {activeTab.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={close}
                      className="group block rounded-md px-3 py-2 transition-colors hover:bg-accent"
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {activeKey && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
