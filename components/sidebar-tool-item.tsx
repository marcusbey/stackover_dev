"use client";

import Link from "next/link";
import Image from "next/image";
import { getLogoUrl } from "@/lib/logos";
import { useState } from "react";

interface SidebarToolItemProps {
  name: string;
  slug: string;
  description: string;
  type: "tool" | "saas";
  websiteUrl: string;
}

export function SidebarToolItem({ name, slug, description, websiteUrl }: SidebarToolItemProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/tools/${slug}`}
      className="flex items-start gap-3 rounded-md p-2 hover:bg-muted transition-colors"
    >
      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
        {imgError ? (
          <span className="text-xs font-bold text-muted-foreground">
            {name.charAt(0)}
          </span>
        ) : (
          <Image
            src={getLogoUrl(websiteUrl)}
            alt={name}
            width={32}
            height={32}
            className="rounded-md object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </Link>
  );
}
