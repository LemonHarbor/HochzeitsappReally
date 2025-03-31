import { supabase } from '@/lib/supabaseClient';
import { Review, ReviewFormData, ReviewStats } from '@/types/review';

/**
 * Get all reviews
 */
export const getReviews = async (): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }

  return data || [];
};

/**
 * Get reviews for a specific vendor
 */
export const getVendorReviews = async (vendorId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vendor reviews:', error);
    throw new Error('Failed to fetch vendor reviews');
  }

  return data || [];
};

/**
 * Get a specific review by ID
 */
export const getReview = async (reviewId: string): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();

  if (error) {
    console.error('Error fetching review:', error);
    throw new Error('Failed to fetch review');
  }

  return data;
};

/**
 * Create a new review
 */
export const createReview = async (reviewData: ReviewFormData, userId: string): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...reviewData,
      user_id: userId,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }

  return data;
};

/**
 * Update a review
 */
export const updateReview = async (reviewId: string, reviewData: Partial<ReviewFormData>): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .update(reviewData)
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }

  return data;
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
};

/**
 * Approve a review
 */
export const approveReview = async (reviewId: string): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status: 'approved' })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error approving review:', error);
    throw new Error('Failed to approve review');
  }

  return data;
};

/**
 * Reject a review
 */
export const rejectReview = async (reviewId: string): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status: 'rejected' })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error rejecting review:', error);
    throw new Error('Failed to reject review');
  }

  return data;
};

/**
 * Get review statistics for a vendor
 */
export const getVendorReviewStats = async (vendorId: string): Promise<ReviewStats> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('vendor_id', vendorId)
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching vendor review stats:', error);
    throw new Error('Failed to fetch vendor review stats');
  }

  const reviews = data || [];
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      total_reviews: 0,
      average_rating: 0,
      rating_distribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    };
  }

  const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = sumRatings / totalReviews;

  const ratingDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  reviews.forEach(review => {
    ratingDistribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
  });

  return {
    total_reviews: totalReviews,
    average_rating: averageRating,
    rating_distribution: ratingDistribution
  };
};
