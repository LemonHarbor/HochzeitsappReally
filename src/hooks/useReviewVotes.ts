import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { ReviewVote } from '@/types/review';

export const useReviewVotes = (reviewId: string) => {
  const [votes, setVotes] = useState<ReviewVote[]>([]);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [unhelpfulCount, setUnhelpfulCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userVote, setUserVote] = useState<ReviewVote | null>(null);

  useEffect(() => {
    let votesChannel: RealtimeChannel;

    const fetchVotes = async () => {
      try {
        setLoading(true);
        
        const { data, error: votesError } = await supabase
          .from('review_votes')
          .select('*')
          .eq('review_id', reviewId);
        
        if (votesError) throw votesError;
        
        setVotes(data || []);
        
        // Calculate counts
        const helpful = data?.filter(vote => vote.vote_type === 'helpful').length || 0;
        const unhelpful = data?.filter(vote => vote.vote_type === 'not_helpful').length || 0;
        
        setHelpfulCount(helpful);
        setUnhelpfulCount(unhelpful);
        
        // Check if current user has voted
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const userVoteData = data?.find(vote => vote.user_id === userData.user.id) || null;
          setUserVote(userVoteData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching review votes:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    const setupSubscriptions = () => {
      // Subscribe to votes changes
      votesChannel = supabase
        .channel(`review_votes:${reviewId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'review_votes', filter: `review_id=eq.${reviewId}` },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              const newVote = payload.new as ReviewVote;
              setVotes(prev => [...prev, newVote]);
              
              if (newVote.vote_type === 'helpful') {
                setHelpfulCount(prev => prev + 1);
              } else {
                setUnhelpfulCount(prev => prev + 1);
              }
              
              // Check if it's the current user's vote
              const { data: userData } = await supabase.auth.getUser();
              if (userData?.user && newVote.user_id === userData.user.id) {
                setUserVote(newVote);
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedVote = payload.new as ReviewVote;
              setVotes(prev => 
                prev.map(vote => vote.id === updatedVote.id ? updatedVote : vote)
              );
              
              // Recalculate counts
              const { data } = await supabase
                .from('review_votes')
                .select('*')
                .eq('review_id', reviewId);
              
              const helpful = data?.filter(vote => vote.vote_type === 'helpful').length || 0;
              const unhelpful = data?.filter(vote => vote.vote_type === 'not_helpful').length || 0;
              
              setHelpfulCount(helpful);
              setUnhelpfulCount(unhelpful);
              
              // Check if it's the current user's vote
              const { data: userData } = await supabase.auth.getUser();
              if (userData?.user && updatedVote.user_id === userData.user.id) {
                setUserVote(updatedVote);
              }
            } else if (payload.eventType === 'DELETE') {
              const deletedVote = payload.old as ReviewVote;
              setVotes(prev => 
                prev.filter(vote => vote.id !== deletedVote.id)
              );
              
              if (deletedVote.vote_type === 'helpful') {
                setHelpfulCount(prev => prev - 1);
              } else {
                setUnhelpfulCount(prev => prev - 1);
              }
              
              // Check if it was the current user's vote
              const { data: userData } = await supabase.auth.getUser();
              if (userData?.user && deletedVote.user_id === userData.user.id) {
                setUserVote(null);
              }
            }
          }
        )
        .subscribe();
    };

    fetchVotes();
    setupSubscriptions();

    return () => {
      votesChannel?.unsubscribe();
    };
  }, [reviewId]);

  return { 
    votes, 
    helpfulCount, 
    unhelpfulCount, 
    userVote, 
    loading, 
    error 
  };
};
