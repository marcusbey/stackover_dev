"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ToolPickerCard } from "./tool-picker-card";
import { Button } from "@/components/ui/button";
import { STACK_LAYERS } from "@/lib/stack-layers";
import { useState } from "react";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";

interface WizardStepProps {
  stepIndex: number;
  selectedToolIds: Id<"tools">[];
  onSelect: (toolIds: Id<"tools">[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function WizardStep({
  stepIndex,
  selectedToolIds,
  onSelect,
  onNext,
  onBack,
  onSkip,
  isFirst,
  isLast,
}: WizardStepProps) {
  const layer = STACK_LAYERS[stepIndex];
  const [showAll, setShowAll] = useState(false);

  const tools = useQuery(api.stacks.toolsForLayer, {
    categories: layer.categories,
    tagFilter: layer.tagFilter,
  });

  const displayTools = showAll ? tools : tools?.slice(0, 12);

  const handleToggle = (toolId: Id<"tools">) => {
    if (layer.allowMultiple) {
      if (selectedToolIds.includes(toolId)) {
        onSelect(selectedToolIds.filter((id) => id !== toolId));
      } else {
        onSelect([...selectedToolIds, toolId]);
      }
    } else {
      // Single select: toggle or replace
      if (selectedToolIds.includes(toolId)) {
        onSelect([]);
      } else {
        onSelect([toolId]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Layer header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{layer.title}</h2>
          {layer.optional && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Optional
            </span>
          )}
          {layer.allowMultiple && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Pick multiple
            </span>
          )}
        </div>
        <p className="text-muted-foreground">{layer.description}</p>
        <p className="text-sm text-muted-foreground/80 italic">
          {layer.whyItMatters}
        </p>
      </div>

      {/* Tool grid */}
      {!tools ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : tools.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No tools found for this category yet. You can skip this step.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayTools?.map((tool) => (
              <ToolPickerCard
                key={tool._id}
                tool={tool}
                selected={selectedToolIds.includes(tool._id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
          {!showAll && tools.length > 12 && (
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-primary hover:underline"
            >
              Show {tools.length - 12} more tools...
            </button>
          )}
        </>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirst}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {layer.optional && (
            <Button variant="ghost" onClick={onSkip}>
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!layer.optional && selectedToolIds.length === 0}
          >
            {isLast ? "Review" : "Next"}
            {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
