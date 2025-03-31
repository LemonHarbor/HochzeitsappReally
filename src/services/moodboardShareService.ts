import { supabase } from '@/lib/supabaseClient';
import { MoodBoardShare, MoodBoardShareFormData } from '@/types/moodboardShare';

/**
 * Share a mood board with another user
 */
export const shareMoodBoard = async (shareData: MoodBoardShareFormData): Promise<MoodBoardShare> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .insert({
      board_id: shareData.board_id,
      shared_with_email: shareData.shared_with_email,
      permission_level: shareData.permission_level,
      is_accepted: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error sharing mood board:', error);
    throw new Error('Failed to share mood board');
  }

  return data;
};

/**
 * Get all shares for a specific mood board
 */
export const getMoodBoardShares = async (boardId: string): Promise<MoodBoardShare[]> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .select('*')
    .eq('board_id', boardId);

  if (error) {
    console.error('Error fetching mood board shares:', error);
    throw new Error('Failed to fetch mood board shares');
  }

  return data || [];
};

/**
 * Accept a mood board share invitation
 */
export const acceptMoodBoardShare = async (shareId: string): Promise<MoodBoardShare> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .update({ is_accepted: true })
    .eq('id', shareId)
    .select()
    .single();

  if (error) {
    console.error('Error accepting mood board share:', error);
    throw new Error('Failed to accept mood board share');
  }

  return data;
};

/**
 * Delete a mood board share
 */
export const deleteMoodBoardShare = async (shareId: string): Promise<void> => {
  const { error } = await supabase
    .from('moodboard_shares')
    .delete()
    .eq('id', shareId);

  if (error) {
    console.error('Error deleting mood board share:', error);
    throw new Error('Failed to delete mood board share');
  }
};

/**
 * Update a mood board share's permission level
 */
export const updateMoodBoardSharePermission = async (
  shareId: string, 
  permissionLevel: 'view' | 'edit'
): Promise<MoodBoardShare> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .update({ permission_level: permissionLevel })
    .eq('id', shareId)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board share permission:', error);
    throw new Error('Failed to update mood board share permission');
  }

  return data;
};

/**
 * Get all mood boards shared with the current user
 */
export const getSharedMoodBoards = async (userEmail: string): Promise<MoodBoardShare[]> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .select('*')
    .eq('shared_with_email', userEmail);

  if (error) {
    console.error('Error fetching shared mood boards:', error);
    throw new Error('Failed to fetch shared mood boards');
  }

  return data || [];
};
