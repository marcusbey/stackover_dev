"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CuratedStackCard } from "@/components/stacks/curated-stack-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hammer } from "lucide-react";

export default function StacksGalleryPage() {
  const stacks = useQuery(api.stacks.curated);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Tech Stacks
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See what top companies use to build their products, or create your own
          tech stack step by step.
        </p>
        <Button size="lg" asChild>
          <Link href="/stacks/new">
            <Hammer className="h-5 w-5 mr-2" />
            Build Your Stack
          </Link>
        </Button>
      </div>

      {/* Curated stacks grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Company Stacks</h2>
        {stacks === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : stacks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Curated stacks coming soon! In the meantime, build your own.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stacks.map((stack) => (
              <CuratedStackCard key={stack._id} stack={stack as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
