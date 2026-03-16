"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ChevronUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface UpvoteButtonProps {
  itemId: Id<"stacks"> | Id<"projects">;
  type: "stack" | "project";
  initialUpvotes?: number;
}

export function UpvoteButton({
  itemId,
  type,
  initialUpvotes = 0,
}: UpvoteButtonProps) {
  const [visitorId, setVisitorId] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [optimisticUpvotes, setOptimisticUpvotes] = useState(initialUpvotes);
  const [optimisticVoted, setOptimisticVoted] = useState<boolean | null>(null);

  // Load visitor ID
  useEffect(() => {
    let id = localStorage.getItem("stackatlas-visitor-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("stackatlas-visitor-id", id);
    }
    setVisitorId(id);
  }, []);

  // Fetch true state from backend
  const hasVotedStatus = useQuery(
    type === "stack"
      ? api.stacks.getVoteStatus
      : (api as any).projects.getVoteStatus,
    visitorId
      ? {
          [type === "stack" ? "stackId" : "projectId"]: itemId,
          visitorId,
        }
      : ("skip" as any),
  );

  const toggleVoteStack = useMutation(api.stacks.toggleVote);
  const toggleVoteProject = useMutation((api as any).projects.toggleVote);

  const isVoted = optimisticVoted !== null ? optimisticVoted : !!hasVotedStatus;

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!visitorId) return;

      // Optimistic update
      const previousVoted = isVoted;
      setOptimisticVoted(!previousVoted);
      setOptimisticUpvotes((prev) => (previousVoted ? prev - 1 : prev + 1));

      try {
        if (type === "stack") {
          await toggleVoteStack({ stackId: itemId as Id<"stacks">, visitorId });
        } else {
          await toggleVoteProject({
            projectId: itemId as Id<"projects">,
            visitorId,
          });
        }
      } catch (error) {
        // Revert on failure
        setOptimisticVoted(previousVoted);
        setOptimisticUpvotes((prev) => (!previousVoted ? prev - 1 : prev + 1));
        console.error("Failed to toggle vote:", error);
      }
    },
    [visitorId, isVoted, type, itemId, toggleVoteStack, toggleVoteProject],
  );

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
        isVoted
          ? "bg-primary/10 border-primary text-primary border"
          : "bg-background border-border hover:border-primary/50 text-muted-foreground border hover:bg-muted/50"
      }`}
      aria-label={isVoted ? "Remove upvote" : "Upvote"}
    >
      <ChevronUp
        className={`h-4 w-4 transition-transform ${
          isVoted ? "text-primary fill-primary" : "text-muted-foreground"
        } ${isHovered && !isVoted ? "-translate-y-0.5" : ""}`}
      />
      <span
        className={`text-xs font-semibold mt-0.5 ${
          isVoted
            ? "text-primary"
            : "text-foreground group-hover:text-primary transition-colors"
        }`}
      >
        {optimisticUpvotes}
      </span>
    </button>
  );
}
