import { supabase } from '@/lib/supabaseClient';
import { MoodBoard, MoodBoardItem, MoodBoardFormData, MoodBoardComment } from '@/types/moodboard';
import { MoodBoardShare, MoodBoardShareFormData } from '@/types/moodboardShare';
import type { Database } from '@/types/supabase';

// Type aliases for better readability
type MoodBoardRow = Database['public']['Tables']['moodboards']['Row'];
type MoodBoardInsert = Database['public']['Tables']['moodboards']['Insert'];
type MoodBoardUpdate = Database['public']['Tables']['moodboards']['Update'];

type MoodBoardItemRow = Database['public']['Tables']['moodboard_items']['Row'];
type MoodBoardItemInsert = Database['public']['Tables']['moodboard_items']['Insert'];
type MoodBoardItemUpdate = Database['public']['Tables']['moodboard_items']['Update'];

type MoodBoardShareRow = Database['public']['Tables']['moodboard_shares']['Row'];
type MoodBoardShareInsert = Database['public']['Tables']['moodboard_shares']['Insert'];
type MoodBoardShareUpdate = Database['public']['Tables']['moodboard_shares']['Update'];

/**
 * Convert database row to MoodBoard type
 */
const toMoodBoard = (row: MoodBoardRow): MoodBoard => ({
  id: row.id,
  name: row.name,
  description: row.description,
  created_at: row.created_at || '',
  updated_at: row.updated_at || '',
  user_id: row.user_id,
  is_public: row.is_public,
  cover_image_url: row.cover_image_url
});

/**
 * Convert database row to MoodBoardItem type
 */
const toMoodBoardItem = (row: MoodBoardItemRow): MoodBoardItem => ({
  id: row.id,
  board_id: row.board_id,
  image_url: row.image_url,
  title: row.title,
  description: row.description,
  position_x: row.position_x,
  position_y: row.position_y,
  width: row.width,
  height: row.height,
  created_at: row.created_at || '',
  updated_at: row.updated_at || '',
  color: row.color,
  tags: row.tags
});

/**
 * Convert database row to MoodBoardShare type
 */
const toMoodBoardShare = (row: MoodBoardShareRow): MoodBoardShare => ({
  id: row.id,
  board_id: row.board_id,
  user_id: row.user_id,
  shared_with_email: row.shared_with_email,
  permission_level: row.permission_level,
  is_accepted: row.is_accepted,
  created_at: row.created_at || '',
  updated_at: row.updated_at || ''
});

/**
 * Get all mood boards for the current user
 */
export const getMoodBoards = async (): Promise<MoodBoard[]> => {
  const { data, error } = await supabase
    .from('moodboards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching mood boards:', error);
    throw new Error('Failed to fetch mood boards');
  }

  return (data || []).map(toMoodBoard);
};

/**
 * Get a specific mood board by ID
 */
export const getMoodBoard = async (boardId: string): Promise<MoodBoard> => {
  const { data, error } = await supabase
    .from('moodboards')
    .select('*')
    .eq('id', boardId)
    .single();

  if (error) {
    console.error('Error fetching mood board:', error);
    throw new Error('Failed to fetch mood board');
  }

  return toMoodBoard(data);
};

/**
 * Create a new mood board
 */
export const createMoodBoard = async (boardData: MoodBoardFormData): Promise<MoodBoard> => {
  const { data, error } = await supabase
    .from('moodboards')
    .insert(boardData as MoodBoardInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating mood board:', error);
    throw new Error('Failed to create mood board');
  }

  return toMoodBoard(data);
};

/**
 * Update a mood board
 */
export const updateMoodBoard = async (boardId: string, boardData: Partial<MoodBoardFormData>): Promise<MoodBoard> => {
  const { data, error } = await supabase
    .from('moodboards')
    .update(boardData as MoodBoardUpdate)
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board:', error);
    throw new Error('Failed to update mood board');
  }

  return toMoodBoard(data);
};

/**
 * Delete a mood board
 */
export const deleteMoodBoard = async (boardId: string): Promise<void> => {
  const { error } = await supabase
    .from('moodboards')
    .delete()
    .eq('id', boardId);

  if (error) {
    console.error('Error deleting mood board:', error);
    throw new Error('Failed to delete mood board');
  }
};

/**
 * Get all items for a specific mood board
 */
export const getMoodBoardItems = async (boardId: string): Promise<MoodBoardItem[]> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching mood board items:', error);
    throw new Error('Failed to fetch mood board items');
  }

  return (data || []).map(toMoodBoardItem);
};

/**
 * Add an item to a mood board
 */
export const addMoodBoardItem = async (item: Omit<MoodBoardItem, 'id' | 'created_at' | 'updated_at'>): Promise<MoodBoardItem> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .insert(item as MoodBoardItemInsert)
    .select()
    .single();

  if (error) {
    console.error('Error adding mood board item:', error);
    throw new Error('Failed to add mood board item');
  }

  return toMoodBoardItem(data);
};

/**
 * Update a mood board item
 */
export const updateMoodBoardItem = async (itemId: string, itemData: Partial<MoodBoardItem>): Promise<MoodBoardItem> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .update(itemData as MoodBoardItemUpdate)
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board item:', error);
    throw new Error('Failed to update mood board item');
  }

  return toMoodBoardItem(data);
};

/**
 * Delete a mood board item
 */
export const deleteMoodBoardItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('moodboard_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting mood board item:', error);
    throw new Error('Failed to delete mood board item');
  }
};

/**
 * Get all comments for a specific mood board
 */
export const getMoodBoardComments = async (boardId: string): Promise<MoodBoardComment[]> => {
  const { data, error } = await supabase
    .from('moodboard_comments')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching mood board comments:', error);
    throw new Error('Failed to fetch mood board comments');
  }

  return data || [];
};

/**
 * Add a comment to a mood board
 */
export const addMoodBoardComment = async (comment: Omit<MoodBoardComment, 'id' | 'created_at' | 'updated_at'>): Promise<MoodBoardComment> => {
  const { data, error } = await supabase
    .from('moodboard_comments')
    .insert(comment)
    .select()
    .single();

  if (error) {
    console.error('Error adding mood board comment:', error);
    throw new Error('Failed to add mood board comment');
  }

  return data;
};

/**
 * Share a mood board with another user
 */
export const shareMoodBoard = async (shareData: MoodBoardShareFormData): Promise<MoodBoardShare> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .insert(shareData as MoodBoardShareInsert)
    .select()
    .single();

  if (error) {
    console.error('Error sharing mood board:', error);
    throw new Error('Failed to share mood board');
  }

  return toMoodBoardShare(data);
};

/**
 * Update a mood board share
 */
export const updateMoodBoardShare = async (shareId: string, shareData: Partial<MoodBoardShare>): Promise<MoodBoardShare> => {
  const { data, error } = await supabase
    .from('moodboard_shares')
    .update(shareData as MoodBoardShareUpdate)
    .eq('id', shareId)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board share:', error);
    throw new Error('Failed to update mood board share');
  }

  return toMoodBoardShare(data);
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
