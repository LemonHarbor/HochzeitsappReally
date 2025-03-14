import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Review } from "@/types/review";
import { getReviewsByVendor } from "@/services/reviewService";

// Hook for real-time review updates
export function useRealtimeReviews(vendorId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!vendorId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    // Fetch initial data
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviewsByVendor(vendorId);
        setReviews(data);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching vendor reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`vendor-reviews-${vendorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vendor_reviews",
          filter: `vendor_id=eq.${vendorId}`,
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === "INSERT") {
            setReviews((current) => [newRecord, ...current]);
            toast({
              title: "Review Added",
              description: "A new review has been added.",
            });
          } else if (eventType === "UPDATE") {
            setReviews((current) =>
              current.map((review) =>
                review.id === oldRecord.id ? newRecord : review,
              ),
            );
            toast({
              title: "Review Updated",
              description: "A review has been updated.",
            });
          } else if (eventType === "DELETE") {
            setReviews((current) =>
              current.filter((review) => review.id !== oldRecord.id),
            );
            toast({
              title: "Review Removed",
              description: "A review has been removed.",
            });
          }
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [vendorId, toast]);

  return { reviews, loading, error };
}
