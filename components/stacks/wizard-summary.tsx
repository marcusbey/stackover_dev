"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getLogoUrl } from "@/lib/logos";
import { STACK_LAYERS } from "@/lib/stack-layers";
import { useMutation, useQuery } from "convex/react";
import { ChevronLeft, Loader2, Rocket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [projectName, setProjectName] = useState("");
  const [projectTagline, setProjectTagline] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [showProject, setShowProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const saveStack = useMutation(api.stacks.save);
  const createProject = useMutation((api as any).projects.create);

  // Collect all unique tool IDs to hydrate
  const allToolIds = Array.from(new Set(Object.values(selections).flat()));

  // We fetch each tool individually — simple approach for summary view
  const toolsMap = useToolsMap(allToolIds);

  const handleSave = async () => {
    if (!stackName.trim()) return;
    if (showProject && (!projectName.trim() || !projectUrl.trim())) return;
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

      if (showProject && projectName.trim() && projectUrl.trim()) {
        try {
          await createProject({
            name: projectName.trim(),
            tagline: projectTagline.trim() || undefined,
            url: projectUrl.trim(),
            visitorId,
            stackId: result.stackId,
          });
        } catch (e) {
          console.error("Failed to create project", e);
        }
      }

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

      <div className="pt-4 border-t border-b pb-4">
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={showProject}
            onChange={(e) => setShowProject(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
          />
          <span className="text-sm font-medium">
            Link a project built with this stack
          </span>
        </label>

        {showProject && (
          <div className="space-y-4 max-w-md p-4 bg-muted/30 rounded-lg border">
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium mb-1.5"
              >
                Project Name *
              </label>
              <Input
                id="project-name"
                placeholder="Product Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="project-url"
                className="block text-sm font-medium mb-1.5"
              >
                Project URL *
              </label>
              <Input
                id="project-url"
                placeholder="https://example.com"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="project-tagline"
                className="block text-sm font-medium mb-1.5"
              >
                Tagline
              </label>
              <Input
                id="project-tagline"
                placeholder="A short description of what it does"
                value={projectTagline}
                onChange={(e) => setProjectTagline(e.target.value)}
              />
            </div>
          </div>
        )}
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
                      return <SummaryToolChip key={id} tool={tool} />;
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
          disabled={
            !stackName.trim() ||
            saving ||
            (showProject && (!projectName.trim() || !projectUrl.trim()))
          }
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
