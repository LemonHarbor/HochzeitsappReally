import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { Review } from "@/types/review";

interface ReviewSummaryProps {
  reviews: Review[];
  averageRating?: number;
  ratingDistribution?: Record<number, number>;
  loading?: boolean;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  reviews = [],
  averageRating = 0,
  ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  loading = false,
}) => {
  // Calculate total reviews
  const totalReviews = reviews.length;

  // Calculate percentage of positive reviews (4-5 stars)
  const positiveReviews =
    (ratingDistribution[4] || 0) + (ratingDistribution[5] || 0);
  const positivePercentage =
    totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

  // Calculate percentage of neutral reviews (3 stars)
  const neutralReviews = ratingDistribution[3] || 0;
  const neutralPercentage =
    totalReviews > 0 ? Math.round((neutralReviews / totalReviews) * 100) : 0;

  // Calculate percentage of negative reviews (1-2 stars)
  const negativeReviews =
    (ratingDistribution[1] || 0) + (ratingDistribution[2] || 0);
  const negativePercentage =
    totalReviews > 0 ? Math.round((negativeReviews / totalReviews) * 100) : 0;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Review Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {totalReviews}{" "}
                  {totalReviews === 1 ? "review" : "reviews"}
                </div>
              </div>

              <div className="col-span-2">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDistribution[rating] || 0;
                    const percentage =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center w-12">
                          <span className="text-sm font-medium">{rating}</span>
                          <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={percentage} className="h-2 flex-1" />
                        <div className="w-12 text-right text-sm text-muted-foreground">
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {positivePercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Positive</div>
                <div className="text-xs text-muted-foreground">(4-5 stars)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">
                  {neutralPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Neutral</div>
                <div className="text-xs text-muted-foreground">(3 stars)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {negativePercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Negative</div>
                <div className="text-xs text-muted-foreground">(1-2 stars)</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSummary;
