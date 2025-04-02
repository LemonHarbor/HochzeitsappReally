import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { MoodBoard, MoodBoardItem, MoodBoardComment } from '@/types/moodboard';
import { MoodBoardShare } from '@/types/moodboardShare';
import { getMoodBoard, getMoodBoardItems } from '@/services/moodboardService';

export const useRealtimeMoodBoard = (boardId: string) => {
  const [moodBoard, setMoodBoard] = useState<MoodBoard | null>(null);
  const [moodBoardItems, setMoodBoardItems] = useState<MoodBoardItem[]>([]);
  const [moodBoardComments, setMoodBoardComments] = useState<MoodBoardComment[]>([]);
  const [moodBoardShares, setMoodBoardShares] = useState<MoodBoardShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let boardChannel: RealtimeChannel;
    let itemsChannel: RealtimeChannel;
    let commentsChannel: RealtimeChannel;
    let sharesChannel: RealtimeChannel;

    const fetchMoodBoard = async () => {
      try {
        setLoading(true);
        
        // Fetch the mood board using the service function
        const boardData = await getMoodBoard(boardId);
        setMoodBoard(boardData);
        
        // Fetch the mood board items using the service function
        const itemsData = await getMoodBoardItems(boardId);
        setMoodBoardItems(itemsData || []);
        
        // Fetch the mood board comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('moodboard_comments')
          .select('*')
          .eq('board_id', boardId)
          .order('created_at', { ascending: true });
        
        if (commentsError) throw commentsError;
        setMoodBoardComments(commentsData || []);
        
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
              // Ensure the payload matches our MoodBoard type
              const newBoard: MoodBoard = {
                id: payload.new.id,
                name: payload.new.name,
                description: payload.new.description,
                created_at: payload.new.created_at,
                updated_at: payload.new.updated_at,
                user_id: payload.new.user_id,
                is_public: payload.new.is_public,
                cover_image_url: payload.new.cover_image_url
              };
              setMoodBoard(newBoard);
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
              // Convert payload to match our MoodBoardItem type
              const newItem: MoodBoardItem = {
                id: payload.new.id,
                board_id: payload.new.board_id,
                image_url: payload.new.image_url,
                title: payload.new.title,
                description: payload.new.description,
                position_x: payload.new.position_x,
                position_y: payload.new.position_y,
                width: payload.new.width,
                height: payload.new.height,
                created_at: payload.new.created_at,
                updated_at: payload.new.updated_at,
                color: payload.new.color,
                tags: payload.new.tags
              };
              setMoodBoardItems(prev => [...prev, newItem]);
            } else if (payload.eventType === 'UPDATE') {
              setMoodBoardItems(prev => 
                prev.map(item => {
                  if (item.id === payload.new.id) {
                    // Convert payload to match our MoodBoardItem type
                    return {
                      id: payload.new.id,
                      board_id: payload.new.board_id,
                      image_url: payload.new.image_url,
                      title: payload.new.title,
                      description: payload.new.description,
                      position_x: payload.new.position_x,
                      position_y: payload.new.position_y,
                      width: payload.new.width,
                      height: payload.new.height,
                      created_at: payload.new.created_at,
                      updated_at: payload.new.updated_at,
                      color: payload.new.color,
                      tags: payload.new.tags
                    };
                  }
                  return item;
                })
              );
            } else if (payload.eventType === 'DELETE') {
              setMoodBoardItems(prev => 
                prev.filter(item => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
      
      // Subscribe to mood board comments changes
      commentsChannel = supabase
        .channel(`moodboard_comments:${boardId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'moodboard_comments', filter: `board_id=eq.${boardId}` },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              // Convert payload to match our MoodBoardComment type
              const newComment: MoodBoardComment = {
                id: payload.new.id,
                board_id: payload.new.board_id,
                item_id: payload.new.item_id,
                user_id: payload.new.user_id,
                content: payload.new.content,
                created_at: payload.new.created_at,
                updated_at: payload.new.updated_at
              };
              setMoodBoardComments(prev => [...prev, newComment]);
            } else if (payload.eventType === 'UPDATE') {
              setMoodBoardComments(prev => 
                prev.map(comment => {
                  if (comment.id === payload.new.id) {
                    // Convert payload to match our MoodBoardComment type
                    return {
                      id: payload.new.id,
                      board_id: payload.new.board_id,
                      item_id: payload.new.item_id,
                      user_id: payload.new.user_id,
                      content: payload.new.content,
                      created_at: payload.new.created_at,
                      updated_at: payload.new.updated_at
                    };
                  }
                  return comment;
                })
              );
            } else if (payload.eventType === 'DELETE') {
              setMoodBoardComments(prev => 
                prev.filter(comment => comment.id !== payload.old.id)
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
              // Convert payload to match our MoodBoardShare type
              const newShare: MoodBoardShare = {
                id: payload.new.id,
                board_id: payload.new.board_id,
                user_id: payload.new.user_id,
                shared_with_email: payload.new.shared_with_email,
                permission_level: payload.new.permission_level,
                is_accepted: payload.new.is_accepted,
                created_at: payload.new.created_at,
                updated_at: payload.new.updated_at
              };
              setMoodBoardShares(prev => [...prev, newShare]);
            } else if (payload.eventType === 'UPDATE') {
              setMoodBoardShares(prev => 
                prev.map(share => {
                  if (share.id === payload.new.id) {
                    // Convert payload to match our MoodBoardShare type
                    return {
                      id: payload.new.id,
                      board_id: payload.new.board_id,
                      user_id: payload.new.user_id,
                      shared_with_email: payload.new.shared_with_email,
                      permission_level: payload.new.permission_level,
                      is_accepted: payload.new.is_accepted,
                      created_at: payload.new.created_at,
                      updated_at: payload.new.updated_at
                    };
                  }
                  return share;
                })
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
      commentsChannel?.unsubscribe();
      sharesChannel?.unsubscribe();
    };
  }, [boardId]);

  // Return the data in the format expected by MoodBoardCanvas.tsx
  return { 
    board: moodBoard, 
    items: moodBoardItems, 
    comments: moodBoardComments, 
    loading, 
    error,
    moodBoard,
    moodBoardItems,
    moodBoardComments,
    moodBoardShares
  };
};

// Add this export to fix the error in MoodBoardList.tsx
export const useRealtimeMoodBoards = (userId: string) => {
  const [moodBoards, setMoodBoards] = useState<MoodBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMoodBoards = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('moodboards')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setMoodBoards(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mood boards:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    fetchMoodBoards();
  }, [userId]);

  return { moodBoards, loading, error };
};
