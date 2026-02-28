"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";
import { Brain, Database, Layers, Box } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  layers: <Layers className="h-4 w-4" />,
};

interface DomainPillsProps {
  activeDomainId: Id<"domains"> | null;
  onSelect: (domainId: Id<"domains"> | null) => void;
}

export function DomainPills({ activeDomainId, onSelect }: DomainPillsProps) {
  const domains = useQuery(api.domains.list);

  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-2 py-3">
            <Button
              variant={activeDomainId === null ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => onSelect(null)}
            >
              <Box className="h-4 w-4 mr-1" />
              All
            </Button>
            {domains?.map((domain) => (
              <Button
                key={domain._id}
                variant={activeDomainId === domain._id ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => onSelect(domain._id)}
              >
                {iconMap[domain.icon] || <Box className="h-4 w-4" />}
                <span className="ml-1">{domain.name}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
