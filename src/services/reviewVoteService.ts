import { supabase } from '@/lib/supabaseClient';
import { ReviewVote } from '@/types/review';

/**
 * Get all votes for a specific review
 */
export const getReviewVotes = async (reviewId: string): Promise<ReviewVote[]> => {
  const { data, error } = await supabase
    .from('review_votes')
    .select('*')
    .eq('review_id', reviewId);

  if (error) {
    console.error('Error fetching review votes:', error);
    throw new Error('Failed to fetch review votes');
  }

  return data || [];
};

/**
 * Get a user's vote for a specific review
 */
export const getUserVote = async (reviewId: string, userId: string): Promise<ReviewVote | null> => {
  const { data, error } = await supabase
    .from('review_votes')
    .select('*')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user vote:', error);
    throw new Error('Failed to fetch user vote');
  }

  return data;
};

/**
 * Add a vote to a review
 */
export const addReviewVote = async (
  reviewId: string, 
  userId: string, 
  voteType: 'helpful' | 'not_helpful'
): Promise<ReviewVote> => {
  // Check if user has already voted
  const existingVote = await getUserVote(reviewId, userId);
  
  if (existingVote) {
    // Update existing vote if vote type is different
    if (existingVote.vote_type !== voteType) {
      return updateReviewVote(existingVote.id, voteType);
    }
    return existingVote;
  }
  
  // Create new vote
  const { data, error } = await supabase
    .from('review_votes')
    .insert({
      review_id: reviewId,
      user_id: userId,
      vote_type: voteType
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding review vote:', error);
    throw new Error('Failed to add review vote');
  }

  return data;
};

/**
 * Update a review vote
 */
export const updateReviewVote = async (
  voteId: string, 
  voteType: 'helpful' | 'not_helpful'
): Promise<ReviewVote> => {
  const { data, error } = await supabase
    .from('review_votes')
    .update({ vote_type: voteType })
    .eq('id', voteId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review vote:', error);
    throw new Error('Failed to update review vote');
  }

  return data;
};

/**
 * Remove a vote from a review
 */
export const removeReviewVote = async (voteId: string): Promise<void> => {
  const { error } = await supabase
    .from('review_votes')
    .delete()
    .eq('id', voteId);

  if (error) {
    console.error('Error removing review vote:', error);
    throw new Error('Failed to remove review vote');
  }
};

/**
 * Get vote counts for a review
 */
export const getReviewVoteCounts = async (reviewId: string): Promise<{ helpful: number; unhelpful: number }> => {
  const votes = await getReviewVotes(reviewId);
  
  const helpful = votes.filter(vote => vote.vote_type === 'helpful').length;
  const unhelpful = votes.filter(vote => vote.vote_type === 'not_helpful').length;
  
  return { helpful, unhelpful };
};
