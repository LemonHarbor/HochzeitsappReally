import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { MoodBoard, MoodBoardItem } from '@/types/moodboard';
import { MoodBoardShare } from '@/types/moodboardShare';

export const useRealtimeMoodBoard = (boardId: string) => {
  const [moodBoard, setMoodBoard] = useState<MoodBoard | null>(null);
  const [moodBoardItems, setMoodBoardItems] = useState<MoodBoardItem[]>([]);
  const [moodBoardShares, setMoodBoardShares] = useState<MoodBoardShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let boardChannel: RealtimeChannel;
    let itemsChannel: RealtimeChannel;
    let sharesChannel: RealtimeChannel;

    const fetchMoodBoard = async () => {
      try {
        setLoading(true);
        
        // Fetch the mood board
        const { data: boardData, error: boardError } = await supabase
          .from('moodboards')
          .select('*')
          .eq('id', boardId)
          .single();
        
        if (boardError) throw boardError;
        setMoodBoard(boardData);
        
        // Fetch the mood board items
        const { data: itemsData, error: itemsError } = await supabase
          .from('moodboard_items')
          .select('*')
          .eq('board_id', boardId)
          .order('created_at', { ascending: true });
        
        if (itemsError) throw itemsError;
        setMoodBoardItems(itemsData || []);
        
        // Fetch the mood board shares
        const { data: sharesData, error: sharesError } = await supabase
          .from('moodboard_shares')
          .select('*')
          .eq('board_id', boardId);
        
        if (sharesError) throw sharesError;
        setMoodBoardShares(sharesData || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mood board data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    const setupSubscriptions = () => {
      // Subscribe to mood board changes
      boardChannel = supabase
        .channel(`moodboard:${boardId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'moodboards', filter: `id=eq.${boardId}` },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              setMoodBoard(null);
            } else {
              setMoodBoard(payload.new as MoodBoard);
            }
          }
        )
        .subscribe();
      
      // Subscribe to mood board items changes
      itemsChannel = supabase
        .channel(`moodboard_items:${boardId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'moodboard_items', filter: `board_id=eq.${boardId}` },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              setMoodBoardItems(prev => [...prev, payload.new as MoodBoardItem]);
            } else if (payload.eventType === 'UPDATE') {
              setMoodBoardItems(prev => 
                prev.map(item => item.id === payload.new.id ? payload.new as MoodBoardItem : item)
              );
            } else if (payload.eventType === 'DELETE') {
              setMoodBoardItems(prev => 
                prev.filter(item => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
      
      // Subscribe to mood board shares changes
      sharesChannel = supabase
        .channel(`moodboard_shares:${boardId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'moodboard_shares', filter: `board_id=eq.${boardId}` },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              setMoodBoardShares(prev => [...prev, payload.new as MoodBoardShare]);
            } else if (payload.eventType === 'UPDATE') {
              setMoodBoardShares(prev => 
                prev.map(share => share.id === payload.new.id ? payload.new as MoodBoardShare : share)
              );
            } else if (payload.eventType === 'DELETE') {
              setMoodBoardShares(prev => 
                prev.filter(share => share.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    fetchMoodBoard();
    setupSubscriptions();

    return () => {
      boardChannel?.unsubscribe();
      itemsChannel?.unsubscribe();
      sharesChannel?.unsubscribe();
    };
  }, [boardId]);

  return { moodBoard, moodBoardItems, moodBoardShares, loading, error };
};
