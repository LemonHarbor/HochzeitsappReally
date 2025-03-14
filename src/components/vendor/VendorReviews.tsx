import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Vendor } from "@/types/vendor";
import { Review } from "@/types/review";
import { useRealtimeReviews } from "@/hooks/useRealtimeReviews";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import {
  createReview,
  updateReview,
  deleteReview,
  getVendorAverageRating,
  getVendorRatingDistribution,
  getReviewByVendorAndUser,
} from "@/services/reviewService";

interface VendorReviewsProps {
  vendor: Vendor;
  onBack: () => void;
}

const VendorReviews: React.FC<VendorReviewsProps> = ({ vendor, onBack }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { reviews, loading } = useRealtimeReviews(vendor.id);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<
    Record<number, number>
  >({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Fetch average rating and distribution when reviews change
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const avgRating = await getVendorAverageRating(vendor.id);
        const distribution = await getVendorRatingDistribution(vendor.id);
        setAverageRating(avgRating);
        setRatingDistribution(distribution);
      } catch (error) {
        console.error("Error fetching rating data:", error);
      }
    };

    fetchRatingData();
  }, [vendor.id, reviews]);

  // Check if current user has already reviewed this vendor
  useEffect(() => {
    const checkUserReview = async () => {
      if (!user) {
        setUserHasReviewed(false);
        return;
      }

      try {
        const userReview = await getReviewByVendorAndUser(vendor.id, user.id);
        setUserHasReviewed(!!userReview);
      } catch (error) {
        console.error("Error checking user review:", error);
      }
    };

    checkUserReview();
  }, [vendor.id, user, reviews]);

  // Handle adding a new review
  const handleAddReview = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to write a review.",
      });
      return;
    }

    if (userHasReviewed) {
      toast({
        title: "Review Exists",
        description:
          "You have already reviewed this vendor. You can edit your existing review.",
      });
      return;
    }

    setIsEditing(false);
    setSelectedReview(null);
    setShowReviewForm(true);
  };

  // Handle editing a review
  const handleEditReview = (review: Review) => {
    setIsEditing(true);
    setSelectedReview(review);
    setShowReviewForm(true);
  };

  // Handle deleting a review
  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete review: ${error.message}`,
      });
    }
  };

  // Handle review form submission
  const handleReviewFormSubmit = async (data: any) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to submit a review.",
        });
        return;
      }

      if (isEditing && selectedReview) {
        // Update existing review
        await updateReview(selectedReview.id, {
          rating: data.rating,
          review_text: data.review_text,
        });
        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        // Add new review
        await createReview(
          {
            vendor_id: vendor.id,
            rating: data.rating,
            review_text: data.review_text,
          },
          user.id,
        );
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted successfully.",
        });
      }

      setShowReviewForm(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "submit"} review: ${error.message}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-muted-foreground">Reviews & Ratings</p>
        </div>
      </div>

      <ReviewList
        reviews={reviews}
        averageRating={averageRating}
        ratingDistribution={ratingDistribution}
        loading={loading}
        onAddReview={handleAddReview}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />

      {/* Review Form Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="sm:max-w-2xl">
          <ReviewForm
            vendorId={vendor.id}
            isEditing={isEditing}
            initialData={selectedReview || {}}
            onSubmit={handleReviewFormSubmit}
            onCancel={() => setShowReviewForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorReviews;
