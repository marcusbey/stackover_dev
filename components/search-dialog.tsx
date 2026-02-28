"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Only search when we have at least 2 chars
  const results = useQuery(
    api.tools.search,
    query.length >= 2 ? { query } : "skip"
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(`/tools/${slug}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools, frameworks, AI models..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.length < 2 ? "Type to search..." : "No tools found."}
        </CommandEmpty>
        {results && results.length > 0 && (
          <CommandGroup heading="Tools">
            {results.map((tool) => (
              <CommandItem
                key={tool._id}
                value={tool.name}
                onSelect={() => handleSelect(tool.slug)}
              >
                <Search className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {tool.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
