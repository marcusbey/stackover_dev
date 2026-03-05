"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StackLayerRow } from "@/components/stacks/stack-layer-row";
import { ShareButtons } from "@/components/stacks/share-buttons";
import Image from "next/image";
import { useState } from "react";

interface StackViewContentProps {
  slug: string;
}

export function StackViewContent({ slug }: StackViewContentProps) {
  const stack = useQuery(api.stacks.bySlug, { slug });

  if (stack === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        <div className="space-y-4 pt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Stack not found</h1>
        <p className="text-muted-foreground mt-2">
          This stack may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  const filledLayers = stack.hydratedLayers.filter(
    (l) => l.tools.length > 0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {stack.isCurated && stack.companyLogoUrl && (
            <CompanyLogo url={stack.companyLogoUrl} name={stack.name} />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {stack.name}
            </h1>
            {stack.description && (
              <p className="text-muted-foreground">{stack.description}</p>
            )}
          </div>
        </div>
        {stack.isCurated && (
          <span className="inline-block text-xs font-medium bg-primary/10 text-primary rounded-full px-2.5 py-0.5">
            Curated Stack
          </span>
        )}
      </div>

      {/* Stack layers */}
      <div className="pt-4">
        {filledLayers.map((layer, i) => (
          <StackLayerRow
            key={layer.layerKey}
            layerKey={layer.layerKey}
            tools={layer.tools
              .filter((t): t is NonNullable<typeof t> => t !== null)
              .map((t) => ({
                _id: t._id,
                name: t.name,
                slug: t.slug,
                description: t.description,
                websiteUrl: t.websiteUrl,
                alivenessScore: t.alivenessScore,
              }))}
            isLast={i === filledLayers.length - 1}
          />
        ))}
      </div>

      {/* Stale warning */}
      {(() => {
        const staleTools = filledLayers.flatMap((l) =>
          l.tools.filter(
            (t): t is NonNullable<typeof t> =>
              t !== null && t.alivenessScore !== undefined && t.alivenessScore < 20
          )
        );
        if (staleTools.length === 0) return null;
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
            {staleTools.length === 1
              ? "1 tool in this stack hasn't been updated in 6+ months"
              : `${staleTools.length} tools in this stack haven't been updated in 6+ months`}
          </div>
        );
      })()}

      {/* Share */}
      <div className="pt-4 border-t">
        <ShareButtons stackName={stack.name} slug={slug} />
      </div>
    </div>
  );
}

function CompanyLogo({ url, name }: { url: string; name: string }) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <Image
      src={url}
      alt={name}
      width={48}
      height={48}
      className="rounded-lg"
      onError={() => setError(true)}
    />
  );
}
