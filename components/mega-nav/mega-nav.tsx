"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Layers, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "./nav-data";
import { useMegaNav } from "./use-mega-nav";
import { NavPanel } from "./nav-panel";
import { MobileNav } from "./mobile-nav";

interface MegaNavProps {
  onSearchOpen: () => void;
}

export function MegaNav({ onSearchOpen }: MegaNavProps) {
  const router = useRouter();
  const { activeKey, open, close, scheduleClose, cancelClose, toggle } =
    useMegaNav();

  return (
    <nav
      className="sticky top-0 z-50"
      onMouseLeave={scheduleClose}
    >
      <div className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <Layers className="h-5 w-5" />
            stackover.dev
          </Link>

          {/* Center: Nav items (desktop) */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className="mega-nav-trigger relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                data-state={activeKey === item.key ? "open" : "closed"}
                onMouseEnter={() => {
                  if (item.columns) open(item.key);
                  else close();
                }}
                onClick={() => {
                  if (item.href) {
                    close();
                    router.push(item.href);
                  } else {
                    toggle(item.key);
                  }
                }}
              >
                {item.label}
                {item.columns && (
                  <ChevronDown className="h-3 w-3 opacity-50 transition-transform data-[state=open]:rotate-180" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Search + Auth + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden items-center gap-2 text-muted-foreground sm:inline-flex md:w-56"
              onClick={onSearchOpen}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search tools...</span>
              <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                <span className="text-xs">&#x2318;</span>K
              </kbd>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden"
              onClick={onSearchOpen}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Link href="/auth/sign-in" className="hidden sm:block">
              <Button variant="default" size="sm">
                Sign in
              </Button>
            </Link>
            <MobileNav onSearchOpen={onSearchOpen} />
          </div>
        </div>
      </div>

      {/* Dropdown panel */}
      <NavPanel
        activeKey={activeKey}
        items={NAV_ITEMS}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      />

      {/* Backdrop to catch outside clicks */}
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
