"use client";

import { getAlivenessTier } from "@/lib/aliveness";
import { cn } from "@/lib/utils";

interface AlivenessBadgeProps {
  score: number | undefined;
  showLabel?: boolean;
  className?: string;
}

export function AlivenessBadge({
  score,
  showLabel = true,
  className,
}: AlivenessBadgeProps) {
  const tier = getAlivenessTier(score);
  if (!tier) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-medium",
        tier.color,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tier.dotColor)} />
      {showLabel && tier.label}
    </span>
  );
}
