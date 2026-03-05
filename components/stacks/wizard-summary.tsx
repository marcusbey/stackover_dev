"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { STACK_LAYERS } from "@/lib/stack-layers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getLogoUrl } from "@/lib/logos";
import { ChevronLeft, Loader2, Rocket } from "lucide-react";

interface WizardSummaryProps {
  selections: Record<string, Id<"tools">[]>;
  visitorId: string;
  onBack: () => void;
}

export function WizardSummary({
  selections,
  visitorId,
  onBack,
}: WizardSummaryProps) {
  const [stackName, setStackName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const saveStack = useMutation(api.stacks.save);

  // Collect all unique tool IDs to hydrate
  const allToolIds = Array.from(
    new Set(Object.values(selections).flat())
  );

  // We fetch each tool individually — simple approach for summary view
  const toolsMap = useToolsMap(allToolIds);

  const handleSave = async () => {
    if (!stackName.trim()) return;
    setSaving(true);

    const layers = STACK_LAYERS.map((layer) => ({
      layerKey: layer.key,
      toolIds: selections[layer.key] ?? [],
    })).filter((l) => l.toolIds.length > 0);

    try {
      const result = await saveStack({
        name: stackName.trim(),
        visitorId,
        layers,
      });
      router.push(`/stacks/${result.slug}`);
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review Your Stack</h2>
        <p className="text-muted-foreground">
          Give your stack a name and review your selections.
        </p>
      </div>

      <div>
        <label
          htmlFor="stack-name"
          className="block text-sm font-medium mb-1.5"
        >
          Stack Name
        </label>
        <Input
          id="stack-name"
          placeholder="e.g. My SaaS Stack, Side Project 2026"
          value={stackName}
          onChange={(e) => setStackName(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="space-y-3">
        {STACK_LAYERS.map((layer) => {
          const toolIds = selections[layer.key] ?? [];
          const isEmpty = toolIds.length === 0;

          return (
            <div
              key={layer.key}
              className="flex items-start gap-4 py-3 border-b last:border-0"
            >
              <div className="w-40 flex-shrink-0">
                <p className="text-sm font-medium">{layer.title}</p>
              </div>
              <div className="flex-1">
                {isEmpty ? (
                  <span className="text-xs text-muted-foreground italic">
                    Skipped
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {toolIds.map((id) => {
                      const tool = toolsMap[id as string];
                      if (!tool) return null;
                      return (
                        <SummaryToolChip key={id} tool={tool} />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={handleSave}
          disabled={!stackName.trim() || saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4 mr-1" />
          )}
          Save & Share
        </Button>
      </div>
    </div>
  );
}

function SummaryToolChip({
  tool,
}: {
  tool: { name: string; websiteUrl: string };
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
      <div className="h-5 w-5 rounded-sm overflow-hidden flex-shrink-0">
        {imgError ? (
          <span className="text-[10px] font-bold text-muted-foreground flex items-center justify-center h-full w-full bg-muted">
            {tool.name.charAt(0)}
          </span>
        ) : (
          <Image
            src={getLogoUrl(tool.websiteUrl)}
            alt={tool.name}
            width={20}
            height={20}
            className="object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <span className="text-sm font-medium">{tool.name}</span>
    </div>
  );
}

// Simple hook to fetch multiple tools by ID
function useToolsMap(toolIds: Id<"tools">[]) {
  // We'll use a batch approach: fetch all tools and filter
  // This is simpler than individual queries
  const allTools: Record<string, any> = {};

  // For each unique category we might need, query tools
  // Actually, simpler: just use individual queries via a workaround
  // Since Convex doesn't have a "byIds" query, we'll create a map from the wizard selections
  // The wizard already has the tool data from each step's query

  // For the summary, we query each layer's tools
  for (const layer of STACK_LAYERS) {
    const tools = useQuery(api.stacks.toolsForLayer, {
      categories: layer.categories,
      tagFilter: layer.tagFilter,
    });
    if (tools) {
      for (const t of tools) {
        allTools[t._id] = t;
      }
    }
  }

  return allTools;
}
