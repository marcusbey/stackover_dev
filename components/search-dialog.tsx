"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import {
  SEARCH_INTENTS,
  type SearchCategory,
} from "@/lib/search-constants";
import { X, Search, ArrowRight } from "lucide-react";

const INTENT_EMOJI: Record<string, string> = {
  rocket: "\u{1F680}", sparkles: "\u2728", database: "\u{1F4BE}",
  smartphone: "\u{1F4F1}", cloud: "\u2601\uFE0F", "credit-card": "\u{1F4B3}",
  lock: "\u{1F512}", layout: "\u{1F4C4}", "bar-chart-3": "\u{1F4CA}",
  server: "\u{1F5A5}\uFE0F", mail: "\u{1F4E7}", zap: "\u26A1",
  "message-square": "\u{1F4AC}", image: "\u{1F5BC}\uFE0F",
  "git-branch": "\u{1F500}", "shopping-cart": "\u{1F6D2}",
  "file-text": "\u{1F4DD}", activity: "\u{1F4C8}",
  "layout-dashboard": "\u{1F4CA}", search: "\u{1F50D}", users: "\u{1F465}",
  palette: "\u{1F3A8}", video: "\u{1F3AC}", headphones: "\u{1F3A7}",
  handshake: "\u{1F91D}", megaphone: "\u{1F4E3}", blocks: "\u{1F9E9}",
  shield: "\u{1F6E1}\uFE0F", "share-2": "\u{1F310}", briefcase: "\u{1F4BC}",
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategorySelect: (category: SearchCategory) => void;
  onSearch: (query: string) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  onCategorySelect,
  onSearch,
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) onOpenChange(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
    else setQuery("");
  }, [open]);

  const submit = useCallback(() => {
    if (query.trim().length >= 2) {
      onSearch(query.trim());
      onOpenChange(false);
    }
  }, [query, onSearch, onOpenChange]);

  const intentClick = useCallback(
    (q: string) => {
      onSearch(q);
      onOpenChange(false);
    },
    [onSearch, onOpenChange]
  );

  if (!open) return null;

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[6px] animate-in fade-in-0 duration-150"
        onClick={() => onOpenChange(false)}
      />

      {/* panel */}
      <div className="fixed inset-x-0 top-0 z-50 animate-in slide-in-from-top-2 duration-200 ease-out">
        <div className="border-b bg-background/95 backdrop-blur-xl shadow-lg">
          <CommandPrimitive
            shouldFilter={false}
            className="flex flex-col"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim().length >= 2) submit();
            }}
          >
            {/* search input */}
            <div className="flex items-center gap-3 px-4 sm:px-6 border-b border-border/40">
              <Search className="h-4 w-4 text-muted-foreground/60 shrink-0" />
              <CommandPrimitive.Input
                ref={inputRef}
                placeholder="Search tools, frameworks, APIs..."
                value={query}
                onValueChange={setQuery}
                className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {query.trim().length >= 2 && (
                <button
                  onClick={submit}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors shrink-0"
                >
                  Go
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
              <kbd
                onClick={() => onOpenChange(false)}
                className="hidden sm:inline-flex h-5 cursor-pointer select-none items-center rounded border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                ESC
              </kbd>
            </div>

            {/* popular searches */}
            <div className="px-4 sm:px-6 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_INTENTS.slice(0, 12).map((intent) => (
                  <button
                    key={intent.label}
                    onClick={() => intentClick(intent.query)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent/50 transition-all"
                  >
                    <span className="leading-none">
                      {INTENT_EMOJI[intent.icon] ?? "\u{1F50D}"}
                    </span>
                    {intent.label}
                  </button>
                ))}
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-t border-border/40 bg-muted/20 text-[11px] text-muted-foreground/50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="h-4 px-1 inline-flex items-center justify-center rounded border border-border/50 bg-background text-[9px]">
                    &crarr;
                  </kbd>
                  search
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="h-4 px-1 inline-flex items-center justify-center rounded border border-border/50 bg-background text-[9px]">
                    esc
                  </kbd>
                  close
                </span>
              </div>
              <span className="tabular-nums">2,400+ products</span>
            </div>
          </CommandPrimitive>
        </div>
      </div>
    </>
  );
}
