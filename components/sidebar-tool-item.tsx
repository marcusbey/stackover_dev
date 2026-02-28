"use client";

import Link from "next/link";

interface SidebarToolItemProps {
  name: string;
  slug: string;
  description: string;
  type: "tool" | "saas";
}

export function SidebarToolItem({ name, slug, description, type }: SidebarToolItemProps) {
  return (
    <Link
      href={`/tools/${slug}`}
      className="flex items-start gap-3 rounded-md p-2 hover:bg-muted transition-colors"
    >
      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 text-xs font-bold text-muted-foreground">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </Link>
  );
}
