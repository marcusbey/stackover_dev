"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getLogoUrl } from "@/lib/logos";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface CuratedStackCardProps {
  stack: {
    slug: string;
    name: string;
    description?: string;
    companyLogoUrl?: string;
    previewTools: {
      _id: string;
      name: string;
      websiteUrl: string;
    }[];
  };
}

export function CuratedStackCard({ stack }: CuratedStackCardProps) {
  return (
    <Link href={`/stacks/${stack.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            {stack.companyLogoUrl && (
              <CompanyLogo url={stack.companyLogoUrl} name={stack.name} />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{stack.name}</h3>
              {stack.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {stack.description}
                </p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>

          {/* Tool logo row */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            {stack.previewTools.slice(0, 6).map((tool) => (
              <ToolMiniLogo key={tool._id} tool={tool} />
            ))}
            {stack.previewTools.length > 6 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{stack.previewTools.length - 6}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CompanyLogo({ url, name }: { url: string; name: string }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-muted-foreground">
          {name.charAt(0)}
        </span>
      </div>
    );
  }
  return (
    <Image
      src={url}
      alt={name}
      width={40}
      height={40}
      className="rounded-lg flex-shrink-0"
      onError={() => setError(true)}
    />
  );
}

function ToolMiniLogo({
  tool,
}: {
  tool: { name: string; websiteUrl: string };
}) {
  const [error, setError] = useState(false);
  return (
    <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border">
      {error ? (
        <span className="text-[9px] font-bold text-muted-foreground">
          {tool.name.charAt(0)}
        </span>
      ) : (
        <Image
          src={getLogoUrl(tool.websiteUrl)}
          alt={tool.name}
          width={24}
          height={24}
          className="object-contain"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
