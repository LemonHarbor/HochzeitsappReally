import { supabase } from "@/lib/supabase";
import { Review, ReviewFormData } from "@/types/review";

// Get all reviews
export const getReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Get reviews by vendor ID
export const getReviewsByVendor = async (
  vendorId: string,
): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching vendor reviews:", error);
    throw error;
  }
};

// Get review by ID
export const getReviewById = async (id: string): Promise<Review> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};

// Get review by vendor and user
export const getReviewByVendorAndUser = async (
  vendorId: string,
  userId: string,
): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .select("*")
      .eq("vendor_id", vendorId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};

// Create a new review
export const createReview = async (
  reviewData: ReviewFormData,
  userId: string,
): Promise<Review> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .insert([{ ...reviewData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Update a review
export const updateReview = async (
  id: string,
  reviewData: Partial<ReviewFormData>,
): Promise<Review> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .update({
        ...reviewData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("vendor_reviews")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Get vendor average rating
export const getVendorAverageRating = async (
  vendorId: string,
): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .select("rating")
      .eq("vendor_id", vendorId);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    return sum / data.length;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    throw error;
  }
};

// Get vendor rating distribution
export const getVendorRatingDistribution = async (
  vendorId: string,
): Promise<Record<number, number>> => {
  try {
    const { data, error } = await supabase
      .from("vendor_reviews")
      .select("rating")
      .eq("vendor_id", vendorId);

    if (error) throw error;

    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    if (data) {
      data.forEach((review) => {
        distribution[review.rating]++;
      });
    }

    return distribution;
  } catch (error) {
    console.error("Error calculating rating distribution:", error);
    throw error;
  }
};
