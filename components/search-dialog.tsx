"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import {
  SEARCH_CATEGORIES,
  SEARCH_INTENTS,
  CATEGORY_MAP,
  type SearchCategory,
} from "@/lib/search-constants";
import { X, Search, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Category groups — semantic clusters so the grid reads at a glance  */
/* ------------------------------------------------------------------ */

const CATEGORY_GROUPS: {
  label: string;
  accent: string;
  slugs: string[];
}[] = [
  {
    label: "Build",
    accent: "text-blue-500",
    slugs: ["web", "mobile", "nocode", "design", "cms"],
  },
  {
    label: "Data & AI",
    accent: "text-violet-500",
    slugs: ["ai", "databases", "analytics", "search"],
  },
  {
    label: "Infra",
    accent: "text-emerald-500",
    slugs: ["cloud", "dev-tools", "auth", "monitoring", "hosting", "domains"],
  },
  {
    label: "Growth",
    accent: "text-amber-500",
    slugs: ["marketing", "sales", "ecommerce", "payments", "hr"],
  },
  {
    label: "Connect",
    accent: "text-cyan-500",
    slugs: ["communication", "collaboration", "support", "social", "automation", "education", "video"],
  },
];

const EMOJI: Record<string, string> = {
  ai: "\u{1F9E0}", "dev-tools": "\u{1F527}", databases: "\u{1F4BE}",
  cloud: "\u2601\uFE0F", web: "\u{1F310}", mobile: "\u{1F4F1}",
  design: "\u{1F3A8}", video: "\u{1F3AC}", nocode: "\u{1F9E9}",
  analytics: "\u{1F4CA}", marketing: "\u{1F4E3}", sales: "\u{1F91D}",
  support: "\u{1F3A7}", collaboration: "\u{1F465}", auth: "\u{1F6E1}\uFE0F",
  payments: "\u{1F4B3}", ecommerce: "\u{1F6D2}", communication: "\u{1F4AC}",
  cms: "\u{1F4DD}", hr: "\u{1F4BC}", education: "\u{1F393}",
  social: "\u{1F310}", automation: "\u26A1", search: "\u{1F50D}",
  monitoring: "\u{1F4C8}",
  hosting: "\u{1F5A5}\uFE0F",
  domains: "\u{1F310}",
};

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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

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

  /* --- shortcuts -------------------------------------------------- */
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

  /* --- handlers --------------------------------------------------- */
  const pick = useCallback(
    (cat: SearchCategory) => {
      onCategorySelect(cat);
      onOpenChange(false);
    },
    [onCategorySelect, onOpenChange]
  );

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
      <div className="fixed top-0 inset-x-0 z-50 animate-in slide-in-from-top-2 duration-200 ease-out">
        <div className="bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] max-h-[70vh] flex flex-col">
          <CommandPrimitive
            shouldFilter={false}
            className="flex flex-col h-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim().length >= 2) submit();
            }}
          >
            {/* ── search bar ─────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-5 sm:px-8 shrink-0 border-b border-border/40">
              <Search className="h-4 w-4 text-muted-foreground/60 shrink-0" />
              <CommandPrimitive.Input
                ref={inputRef}
                placeholder="What are you building?"
                value={query}
                onValueChange={setQuery}
                className="flex h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/50"
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

            {/* ── scrollable body ────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* category groups */}
              <div className="px-5 sm:px-8 py-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-5">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.label}>
                      <h3
                        className={`text-[10px] font-semibold uppercase tracking-[0.08em] mb-2 ${group.accent}`}
                      >
                        {group.label}
                      </h3>
                      <div className="space-y-0.5">
                        {group.slugs.map((slug) => {
                          const cat = CATEGORY_MAP[slug];
                          if (!cat) return null;
                          return (
                            <button
                              key={slug}
                              onClick={() => pick(cat)}
                              className="flex items-center gap-2 w-full px-1.5 py-[5px] -mx-1.5 rounded-md text-[13px] text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors text-left group"
                            >
                              <span className="text-xs opacity-50 group-hover:opacity-80 transition-opacity w-4 text-center leading-none">
                                {EMOJI[slug] ?? "\u{1F4E6}"}
                              </span>
                              <span>{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* intent pills */}
              <div className="px-5 sm:px-8 pb-5 pt-1">
                <div className="border-t border-border/40 pt-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60 mb-2.5">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SEARCH_INTENTS.slice(0, 10).map((intent) => (
                      <button
                        key={intent.label}
                        onClick={() => intentClick(intent.query)}
                        className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full border border-border/50 text-[11px] text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent/40 transition-all"
                      >
                        <span className="leading-none">
                          {INTENT_EMOJI[intent.icon] ?? "\u{1F50D}"}
                        </span>
                        <span>{intent.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── footer ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-2 border-t border-border/40 bg-muted/20 shrink-0 text-[11px] text-muted-foreground/50">
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
