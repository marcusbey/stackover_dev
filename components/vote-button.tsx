"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface VoteButtonProps {
  toolId: Id<"tools">;
  filterNodeId: Id<"filterNodes">;
  voteCount: number;
  hasVoted?: boolean;
}

export function VoteButton({ toolId, filterNodeId, voteCount, hasVoted }: VoteButtonProps) {
  const castVote = useMutation(api.votes.cast);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // For MVP, use a random visitor ID stored in localStorage
    let visitorId = localStorage.getItem("stackatlas-visitor-id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("stackatlas-visitor-id", visitorId);
    }
    await castVote({ visitorId, toolId, filterNodeId, value: 1 });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex flex-col items-center gap-0 h-auto py-1 px-2 min-w-[48px]",
        hasVoted && "border-primary text-primary bg-primary/5"
      )}
      onClick={handleVote}
    >
      <ChevronUp className="h-4 w-4" />
      <span className="text-xs font-medium">{voteCount}</span>
    </Button>
  );
}
