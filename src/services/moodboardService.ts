import { supabase } from '@/lib/supabaseClient';
import { MoodBoard, MoodBoardItem, MoodBoardFormData } from '@/types/moodboard';

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

  return data || [];
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

  return data;
};

/**
 * Create a new mood board
 */
export const createMoodBoard = async (boardData: MoodBoardFormData): Promise<MoodBoard> => {
  const { data, error } = await supabase
    .from('moodboards')
    .insert(boardData)
    .select()
    .single();

  if (error) {
    console.error('Error creating mood board:', error);
    throw new Error('Failed to create mood board');
  }

  return data;
};

/**
 * Update a mood board
 */
export const updateMoodBoard = async (boardId: string, boardData: Partial<MoodBoardFormData>): Promise<MoodBoard> => {
  const { data, error } = await supabase
    .from('moodboards')
    .update(boardData)
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board:', error);
    throw new Error('Failed to update mood board');
  }

  return data;
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

  return data || [];
};

/**
 * Add an item to a mood board
 */
export const addMoodBoardItem = async (item: Omit<MoodBoardItem, 'id' | 'created_at' | 'updated_at'>): Promise<MoodBoardItem> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error adding mood board item:', error);
    throw new Error('Failed to add mood board item');
  }

  return data;
};

/**
 * Update a mood board item
 */
export const updateMoodBoardItem = async (itemId: string, itemData: Partial<MoodBoardItem>): Promise<MoodBoardItem> => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .update(itemData)
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating mood board item:', error);
    throw new Error('Failed to update mood board item');
  }

  return data;
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
