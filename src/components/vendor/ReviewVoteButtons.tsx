import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useReviewVote } from "@/hooks/useReviewVotes";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ReviewVoteButtonsProps {
  reviewId: string;
  helpfulCount?: number;
  unhelpfulCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ReviewVoteButtons: React.FC<ReviewVoteButtonsProps> = ({
  reviewId,
  helpfulCount: initialHelpfulCount,
  unhelpfulCount: initialUnhelpfulCount,
  size = "md",
  className,
}) => {
  const { user } = useAuth();
  const {
    helpfulCount,
    unhelpfulCount,
    isHelpful,
    isUnhelpful,
    voteHelpful,
    voteUnhelpful,
    removeVote,
    loading,
  } = useReviewVote(reviewId, user?.id);

  // Use provided counts if available, otherwise use from hook
  const displayHelpfulCount =
    initialHelpfulCount !== undefined ? initialHelpfulCount : helpfulCount;
  const displayUnhelpfulCount =
    initialUnhelpfulCount !== undefined
      ? initialUnhelpfulCount
      : unhelpfulCount;

  // Get size classes
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "text-xs gap-1";
      case "lg":
        return "text-base gap-2";
      default: // md
        return "text-sm gap-1.5";
    }
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case "sm":
        return 14;
      case "lg":
        return 20;
      default: // md
        return 16;
    }
  };

  const sizeClass = getSizeClasses(size);
  const iconSize = getIconSize(size);

  const handleHelpfulClick = () => {
    if (!user) return;
    if (isHelpful) {
      removeVote();
    } else {
      voteHelpful();
    }
  };

  const handleUnhelpfulClick = () => {
    if (!user) return;
    if (isUnhelpful) {
      removeVote();
    } else {
      voteUnhelpful();
    }
  };

  return (
    <div className={cn("flex items-center", sizeClass, className)}>
      <span className="text-muted-foreground mr-2">Was this helpful?</span>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 h-auto py-1 px-2",
            isHelpful && "bg-primary/10 text-primary",
          )}
          onClick={handleHelpfulClick}
          disabled={loading || !user}
          title={user ? "Mark as helpful" : "Sign in to vote"}
        >
          <ThumbsUp size={iconSize} />
          <span>{displayHelpfulCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 h-auto py-1 px-2",
            isUnhelpful && "bg-destructive/10 text-destructive",
          )}
          onClick={handleUnhelpfulClick}
          disabled={loading || !user}
          title={user ? "Mark as not helpful" : "Sign in to vote"}
        >
          <ThumbsDown size={iconSize} />
          <span>{displayUnhelpfulCount}</span>
        </Button>
      </div>
    </div>
  );
};

export default ReviewVoteButtons;
