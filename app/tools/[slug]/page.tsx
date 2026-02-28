"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ToolProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const tool = useQuery(api.tools.bySlug, { slug });

  if (tool === undefined) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-20 w-20 bg-muted animate-pulse rounded-xl" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (tool === null) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explorer
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explorer
      </Link>

      {/* Tool header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
          <Image
            src={tool.logoUrl}
            alt={tool.name}
            width={40}
            height={40}
            className="rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{tool.name}</h1>
            <Badge variant="secondary" className="text-sm">
              {tool.baselineScore.toFixed(1)}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {tool.type}
            </Badge>
          </div>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      {/* Website link */}
      <a
        href={tool.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mb-8"
      >
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Website
        </Button>
      </a>

      <Separator className="mb-8" />

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-green-600 mb-3">Pros</h3>
            <ul className="space-y-2">
              {tool.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-red-600 mb-3">Cons</h3>
            <ul className="space-y-2">
              {tool.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 mt-6">
        {tool.isHot && <Badge variant="destructive">Hot</Badge>}
        {tool.isTrending && (
          <Badge className="bg-green-600">Trending</Badge>
        )}
      </div>
    </div>
  );
}
