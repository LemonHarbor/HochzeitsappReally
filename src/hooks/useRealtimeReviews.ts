import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Review } from '@/types/review';

export const useRealtimeReviews = (vendorId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let reviewsChannel: RealtimeChannel;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (vendorId) {
          query = query.eq('vendor_id', vendorId);
        }
        
        const { data, error: reviewsError } = await query;
        
        if (reviewsError) throw reviewsError;
        setReviews(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    const setupSubscriptions = () => {
      // Subscribe to reviews changes
      const filter = vendorId ? `vendor_id=eq.${vendorId}` : undefined;
      
      reviewsChannel = supabase
        .channel('reviews-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'reviews',
            filter
          },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              setReviews(prev => [payload.new as Review, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setReviews(prev => 
                prev.map(review => review.id === payload.new.id ? payload.new as Review : review)
              );
            } else if (payload.eventType === 'DELETE') {
              setReviews(prev => 
                prev.filter(review => review.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    fetchReviews();
    setupSubscriptions();

    return () => {
      reviewsChannel?.unsubscribe();
    };
  }, [vendorId]);

  return { reviews, loading, error };
};
