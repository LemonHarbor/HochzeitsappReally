import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";
import ReviewList from "./ReviewList";
import ReviewModeration from "./ReviewModeration";
import { Review } from "../../../../src/types/review";
import { getReviewsByVendor, moderateReview } from "../../../../src/services/reviewService";
import { useAuth } from "../../../../src/context/AuthContext";

interface VendorReviewModerationProps {
  vendorId: string;
}

const VendorReviewModeration: React.FC<VendorReviewModerationProps> = ({
  vendorId,
}) => {
  const { user, permissions } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reviews");

  const canModerate = permissions.canManagePermissions;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // If user can moderate, fetch all reviews including non-approved ones
        const data = await getReviewsByVendor(vendorId, canModerate);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [vendorId, canModerate]);

  const handleReviewModerated = (updatedReview: Review) => {
    // Update the reviews list with the moderated review
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review,
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {canModerate && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews">
              <ReviewList
                reviews={reviews}
                loading={loading}
                showPendingReviews={true}
              />
            </TabsContent>
            <TabsContent value="moderation">
              <ReviewModeration onReviewModerated={handleReviewModerated} />
            </TabsContent>
          </Tabs>
        )}

        {!canModerate && <ReviewList reviews={reviews} loading={loading} />}
      </CardContent>
    </Card>
  );
};

export default VendorReviewModeration;
