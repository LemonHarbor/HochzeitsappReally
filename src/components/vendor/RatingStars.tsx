import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = "md",
  interactive = false,
  onChange = () => {},
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

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={interactive ? "cursor-pointer" : undefined}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHoveredRating(star)}
          onMouseLeave={() => interactive && setHoveredRating(null)}
        >
          <Star
            className={`${sizeClass} ${
              (
                interactive && hoveredRating !== null
                  ? star <= hoveredRating
                  : star <= rating
              )
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default RatingStars;
