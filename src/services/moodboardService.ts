import { supabase } from '@/lib/supabaseClient';
import { MoodBoard, MoodBoardItem, MoodBoardComment } from '@/types/moodboard';
import { MoodBoardShare } from '@/types/moodboardShare';
import { v4 as uuidv4 } from 'uuid';

// Get a single mood board by ID
export const getMoodBoard = async (id: string): Promise<MoodBoard | null> => {
  const { data, error } = await supabase
    .from('moodboards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching mood board:', error);
    throw error;
  }

  return data;
};

// Get all mood boards for a user
export const getMoodBoards = async (userId: string): Promise<MoodBoard[]> => {
  const { data, error } = await supabase
    .from('moodboards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching mood boards:', error);
    throw error;
  }

  return data || [];
};

// Create a new mood board
export const createMoodBoard = async (moodBoard: Omit<MoodBoard, 'id' | 'created_at' | 'updated_at'>): Promise<MoodBoard> => {
  const { data, error } = await supabase
    .from('moodboards')
    .insert(moodBoard)
    .select()
    .single();

  if (error) {
    console.error('Error creating mood board:', error);
    throw error;
  }

  return data;
};

// Update an existing mood board
export const updateMoodBoard = async (id: string, updates: Partial<MoodBoard>): Promise<MoodBoard> => {
  const { data, error } = await supabase
    .from('moodboards')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board:', error);
    throw error;
  }

  return data;
};

// Delete a mood board
export const deleteMoodBoard = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('moodboards')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting mood board:', error);
    throw error;
  }
};

// Get all items for a mood board
export const getMoodBoardItems = async (boardId: string): Promise<MoodBoardItem[]> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching mood board items:', error);
    throw error;
  }

  return data || [];
};

// Add a new item to a mood board
export const addMoodBoardItem = async (item: Omit<MoodBoardItem, 'id' | 'created_at' | 'updated_at'>): Promise<MoodBoardItem> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error adding mood board item:', error);
    throw error;
  }

  return data;
};

// Update an existing mood board item
export const updateMoodBoardItem = async (id: string, updates: Partial<MoodBoardItem>): Promise<MoodBoardItem> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board item:', error);
    throw error;
  }

  return data;
};

// Delete a mood board item
export const deleteMoodBoardItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('moodboard_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting mood board item:', error);
    throw error;
  }
};

// Add a comment to a mood board
export const addMoodBoardComment = async (comment: Omit<MoodBoardComment, 'id' | 'created_at' | 'updated_at'>): Promise<MoodBoardComment> => {
  const { data, error } = await supabase
    .from('moodboard_comments')
    .insert(comment)
    .select()
    .single();

  if (error) {
    console.error('Error adding mood board comment:', error);
    throw error;
  }

  return data;
};

// Delete a mood board comment
export const deleteMoodBoardComment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('moodboard_comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting mood board comment:', error);
    throw error;
  }
};

// Share a mood board with another user
export const shareMoodBoard = async (share: Omit<MoodBoardShare, 'id' | 'created_at' | 'updated_at'>): Promise<MoodBoardShare> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .insert(share)
    .select()
    .single();

  if (error) {
    console.error('Error sharing mood board:', error);
    throw error;
  }

  return data;
};

// Delete a mood board share
export const deleteMoodBoardShare = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('moodboard_shares')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting mood board share:', error);
    throw error;
  }
};

// Upload an image for a mood board
export const uploadMoodBoardImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `moodboard-images/${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('moodboard-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('moodboard-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Generate a shareable link for a mood board
export const generateShareableLink = (boardId: string): string => {
  return `${window.location.origin}/moodboard/shared/${boardId}`;
};

// Remove a mood board share (alias for deleteMoodBoardShare for backward compatibility)
export const removeMoodBoardShare = deleteMoodBoardShare;
