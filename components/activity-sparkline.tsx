"use client";

import { getAlivenessTier } from "@/lib/aliveness";
import { cn } from "@/lib/utils";

interface ActivitySparklineProps {
  data: number[];
  alivenessScore?: number;
  height?: number;
  className?: string;
}

export function ActivitySparkline({
  data,
  alivenessScore,
  height = 24,
  className,
}: ActivitySparklineProps) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data, 1);
  const tier = getAlivenessTier(alivenessScore);
  const barColor = tier?.dotColor ?? "bg-muted-foreground/30";

  return (
    <div
      className={cn("flex items-end gap-px", className)}
      style={{ height }}
      title={`${data.reduce((a, b) => a + b, 0)} commits over ${data.length} weeks`}
    >
      {data.map((value, i) => {
        const pct = Math.max((value / max) * 100, 4);
        return (
          <div
            key={i}
            className={cn("flex-1 rounded-sm min-w-[3px]", barColor)}
            style={{ height: `${pct}%` }}
          />
        );
      })}
    </div>
  );
}
