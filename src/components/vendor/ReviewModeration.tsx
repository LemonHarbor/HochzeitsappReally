import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Review, ReviewStatus } from "@/types/review";
import { useAuth } from "@/context/AuthContext";
import {
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getPendingReviews, moderateReview } from "@/services/reviewService";

interface ReviewModerationProps {
  onReviewModerated?: (review: Review) => void;
}

const ReviewModeration: React.FC<ReviewModerationProps> = ({
  onReviewModerated = () => {},
}) => {
  const { user, permissions } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");
  const [moderationStatus, setModerationStatus] = useState<ReviewStatus | null>(
    null,
  );
  const [verifyReview, setVerifyReview] = useState(false);
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);

  // Check if user can moderate reviews
  const canModerateReviews = permissions.canManagePermissions;

  useEffect(() => {
    if (!canModerateReviews) return;

    const fetchPendingReviews = async () => {
      try {
        setLoading(true);
        const data = await getPendingReviews();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching pending reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, [canModerateReviews]);

  // Format date
  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Get user initials for avatar
  const getUserInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  const handleModerateClick = (review: Review) => {
    setSelectedReview(review);
    setModerationNotes("");
    setModerationStatus(null);
    setModerationDialogOpen(true);
  };

  const handleModerateSubmit = async () => {
    if (!selectedReview || !moderationStatus || !user) return;

    try {
      const updatedReview = await moderateReview(
        selectedReview.id,
        moderationStatus,
        user.id,
        moderationNotes,
        verifyReview,
      );

      // Update the reviews list
      setReviews(reviews.filter((review) => review.id !== selectedReview.id));
      onReviewModerated(updatedReview);
      setModerationDialogOpen(false);
    } catch (error) {
      console.error("Error moderating review:", error);
    }
  };

  if (!canModerateReviews) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
            <p>You don't have permission to moderate reviews.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Moderation</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-50">
                        <AlertCircle className="h-3 w-3 mr-1 text-yellow-500" />
                        Pending
                      </Badge>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 whitespace-pre-line">
                    {review.review_text}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerateClick(review)}
                    >
                      Moderate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="mx-auto h-12 w-12 mb-4 text-green-500" />
              <p>No reviews pending moderation.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Dialog */}
      <Dialog
        open={moderationDialogOpen}
        onOpenChange={setModerationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate Review</DialogTitle>
            <DialogDescription>
              Review the content and decide whether to approve or reject.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {getUserInitials(selectedReview.user_id)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    User {selectedReview.user_id.substring(0, 8)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatReviewDate(selectedReview.created_at || "")}
                  </div>
                </div>
                <div className="ml-auto flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-md border p-4 bg-muted/50">
                <p className="whitespace-pre-line">
                  {selectedReview.review_text}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="moderation-notes">Moderation Notes</Label>
                  <Textarea
                    id="moderation-notes"
                    placeholder="Add notes about why this review was approved or rejected"
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    className="min-h-[100px] mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verify-review"
                    checked={verifyReview}
                    onChange={() => setVerifyReview(!verifyReview)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="verify-review"
                    className="flex items-center cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
                    Mark as verified review (admin verification)
                  </Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setModerationStatus("rejected")}
                className={`${moderationStatus === "rejected" ? "bg-red-100 border-red-300" : ""}`}
              >
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => setModerationStatus("approved")}
                className={`${moderationStatus === "approved" ? "bg-green-100 border-green-300" : ""}`}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Approve
              </Button>
            </div>
            <Button onClick={handleModerateSubmit} disabled={!moderationStatus}>
              Submit Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewModeration;
