"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { getLogoUrl } from "@/lib/logos";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolPickerCardProps {
  tool: {
    _id: Id<"tools">;
    name: string;
    description: string;
    websiteUrl: string;
    baselineScore: number;
    tags?: string[];
  };
  selected: boolean;
  onToggle: (id: Id<"tools">) => void;
}

export function ToolPickerCard({ tool, selected, onToggle }: ToolPickerCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onToggle(tool._id)}
      className="text-left w-full"
    >
      <Card
        className={cn(
          "transition-all cursor-pointer h-full",
          selected
            ? "ring-2 ring-primary border-primary bg-primary/5"
            : "hover:shadow-md hover:border-muted-foreground/20"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden relative">
              {imgError ? (
                <span className="text-sm font-bold text-muted-foreground">
                  {tool.name.charAt(0)}
                </span>
              ) : (
                <Image
                  src={getLogoUrl(tool.websiteUrl)}
                  alt={tool.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                  onError={() => setImgError(true)}
                />
              )}
              {selected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tool.baselineScore.toFixed(1)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {tool.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
