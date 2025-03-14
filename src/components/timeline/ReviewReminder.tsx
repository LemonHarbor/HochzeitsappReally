import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vendor } from "@/types/vendor";
import { Star, MessageSquare } from "lucide-react";
import { getReviewByVendorAndUser } from "@/services/reviewService";
import { useAuth } from "@/context/AuthContext";

interface ReviewReminderProps {
  vendors: Vendor[];
  onReviewVendor: (vendor: Vendor) => void;
}

const ReviewReminder: React.FC<ReviewReminderProps> = ({
  vendors,
  onReviewVendor,
}) => {
  const { user } = useAuth();
  const [pendingReviews, setPendingReviews] = React.useState<Vendor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkPendingReviews = async () => {
      if (!user || vendors.length === 0) {
        setPendingReviews([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const pendingVendors = [];

        for (const vendor of vendors) {
          const review = await getReviewByVendorAndUser(vendor.id, user.id);
          if (!review) {
            pendingVendors.push(vendor);
          }
        }

        setPendingReviews(pendingVendors);
      } catch (error) {
        console.error("Error checking pending reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPendingReviews();
  }, [vendors, user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingReviews.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Vendor Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Share your experience with these vendors to help other couples make
          informed decisions.
        </p>
        <div className="space-y-3">
          {pendingReviews.slice(0, 3).map((vendor) => (
            <div
              key={vendor.id}
              className="flex justify-between items-center p-3 border rounded-md"
            >
              <div>
                <div className="font-medium">{vendor.name}</div>
                <Badge variant="outline" className="mt-1">
                  {vendor.category}
                </Badge>
              </div>
              <Button size="sm" onClick={() => onReviewVendor(vendor)}>
                <Star className="mr-2 h-4 w-4" />
                Review
              </Button>
            </div>
          ))}

          {pendingReviews.length > 3 && (
            <p className="text-sm text-center text-muted-foreground">
              +{pendingReviews.length - 3} more vendors to review
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewReminder;
