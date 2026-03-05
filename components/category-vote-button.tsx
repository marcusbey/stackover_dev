"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface CategoryVoteButtonProps {
  toolId: Id<"tools">;
  category: string;
  netVotes: number;
  userVote?: number; // +1, -1, or undefined
}

export function CategoryVoteButton({
  toolId,
  category,
  netVotes,
  userVote,
}: CategoryVoteButtonProps) {
  const castVote = useMutation(api.categoryVotes.cast);

  const handleVote = async (e: React.MouseEvent, value: number) => {
    e.stopPropagation();
    e.preventDefault();
    let visitorId = localStorage.getItem("stackatlas-visitor-id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("stackatlas-visitor-id", visitorId);
    }
    await castVote({ visitorId, toolId, category, value });
  };

  return (
    <div className="flex flex-col items-center gap-0">
      <button
        onClick={(e) => handleVote(e, 1)}
        className={cn(
          "p-0.5 rounded hover:bg-accent transition-colors",
          userVote === 1 && "text-green-600"
        )}
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <span
        className={cn(
          "text-xs font-semibold tabular-nums",
          netVotes > 0 && "text-green-600",
          netVotes < 0 && "text-red-500"
        )}
      >
        {netVotes}
      </span>
      <button
        onClick={(e) => handleVote(e, -1)}
        className={cn(
          "p-0.5 rounded hover:bg-accent transition-colors",
          userVote === -1 && "text-red-500"
        )}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
