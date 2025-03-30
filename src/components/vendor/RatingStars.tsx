import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = "md",
  interactive = false,
  onChange = () => {},
  label,
  showValue = false,
  className,
}) => {
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

  // Get size classes
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-3 w-3";
      case "lg":
        return "h-6 w-6";
      default: // md
        return "h-4 w-4";
    }
  };

  const sizeClass = getSizeClasses(size);
  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={cn(
              "transition-transform",
              interactive ? "cursor-pointer hover:scale-110" : undefined,
            )}
            onClick={() => interactive && onChange(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(null)}
            aria-label={`Rate ${star} out of 5 stars`}
            role={interactive ? "button" : undefined}
          >
            <Star
              className={cn(
                sizeClass,
                "transition-colors duration-200",
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground hover:text-yellow-200",
                interactive && star <= displayRating && "drop-shadow-sm",
              )}
            />
          </div>
        ))}
        {showValue && (
          <span className="ml-2 text-sm font-medium">
            {displayRating.toFixed(1)}
          </span>
        )}
      </div>
      {interactive && (
        <div className="text-xs text-muted-foreground mt-1">
          {hoveredRating
            ? `Rating: ${hoveredRating} out of 5`
            : "Click to rate"}
        </div>
      )}
    </div>
  );
};

export default RatingStars;
