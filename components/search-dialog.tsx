"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import {
  SEARCH_INTENTS,
  type SearchCategory,
} from "@/lib/search-constants";
import { X, Search, ArrowRight } from "lucide-react";
import { IntentIcon } from "@/components/intent-icon";

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
                    <IntentIcon name={intent.icon} className="h-3.5 w-3.5 shrink-0" />
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
