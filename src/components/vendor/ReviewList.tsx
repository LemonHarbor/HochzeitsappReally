import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { format, formatDistanceToNow } from "date-fns";
import { Review } from "@/types/review";
import { useAuth } from "@/context/AuthContext";
import { Star, Edit, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReviewListProps {
  reviews: Review[];
  averageRating?: number;
  ratingDistribution?: Record<number, number>;
  loading?: boolean;
  onAddReview?: () => void;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (id: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  averageRating = 0,
  ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  loading = false,
  onAddReview = () => {},
  onEditReview = () => {},
  onDeleteReview = () => {},
}) => {
  const { user } = useAuth();
  const [reviewToDelete, setReviewToDelete] = React.useState<string | null>(
    null,
  );

  // Calculate total reviews
  const totalReviews = reviews.length;

  // Format date
  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Check if user can edit/delete a review
  const canModifyReview = (review: Review) => {
    return user && user.id === review.user_id;
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (reviewToDelete) {
      onDeleteReview(reviewToDelete);
      setReviewToDelete(null);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (userId: string) => {
    // In a real app, you would fetch the user's name
    // For now, just use the first two characters of the user ID
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>Reviews & Ratings</CardTitle>
            <Button onClick={onAddReview}>
              <Plus className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          <Separator className="my-6" />

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getUserInitials(review.user_id)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          User {review.user_id.substring(0, 8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatReviewDate(review.created_at || "")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 whitespace-pre-line">
                    {review.review_text}
                  </div>
                  {canModifyReview(review) && (
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditReview(review)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setReviewToDelete(review.id)}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet. Be the first to review this vendor!</p>
              <Button variant="outline" onClick={onAddReview} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewList;
