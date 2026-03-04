"use client";

import { Button } from "@/components/ui/button";
import { Search, Layers } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onSearchOpen: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Layers className="h-5 w-5" />
          stackover.dev
        </Link>

        <Button
          variant="outline"
          className="hidden sm:flex items-center gap-2 text-muted-foreground w-64 justify-start"
          onClick={onSearchOpen}
        >
          <Search className="h-4 w-4" />
          <span>Search tools...</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">&#x2318;</span>K
          </kbd>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="sm:hidden" onClick={onSearchOpen}>
            <Search className="h-4 w-4" />
          </Button>
          <Link href="/auth/sign-in">
            <Button variant="default" size="sm">Sign in</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
