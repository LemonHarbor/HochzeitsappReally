// Type definitions for moodboard service
export interface MoodBoard {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_public: boolean;
  cover_image_url?: string;
}

export interface MoodBoardItem {
  id: string;
  board_id: string;
  image_url: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
}

export interface MoodBoardShare {
  id: string;
  board_id: string;
  shared_by: string;
  shared_with_id: string;
  permission: "view" | "edit" | "admin";
  created_at: string;
  updated_at: string;
}

// Mock data for development
const mockMoodBoards: MoodBoard[] = [
  {
    id: "1",
    title: "Wedding Theme Ideas",
    description: "Collection of theme ideas for our wedding",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1",
    is_public: false,
  },
  {
    id: "2",
    title: "Venue Inspiration",
    description: "Potential venues for the ceremony and reception",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1",
    is_public: true,
  },
];

// Service functions
import { supabase } from "@/lib/supabase";

// Get all mood boards for a user
export async function getMoodBoards(userId: string): Promise<MoodBoard[]> {
  try {
    // Get boards created by the user
    const { data: ownedBoards, error: ownedError } = await supabase
      .from("mood_boards")
      .select("*")
      .eq("created_by", userId);

    if (ownedError) throw ownedError;

    // Get boards shared with the user
    const { data: sharedData, error: sharedError } = await supabase
      .from("mood_board_shares")
      .select(`
        id,
        board_id,
        permission,
        mood_boards:board_id(*)
      `)
      .eq("shared_with_id", userId);

    if (sharedError) throw sharedError;

    // Extract the shared boards from the join query
    const sharedBoards = sharedData
      .filter(item => item.mood_boards)
      .map(item => ({
        ...item.mood_boards,
        shared: true,
        permission: item.permission,
      }));

    // Combine owned and shared boards
    return [...ownedBoards, ...sharedBoards];
  } catch (error) {
    console.error("Error fetching mood boards:", error);
    throw error;
  }
}

// Get a single mood board by ID
export async function getMoodBoard(boardId: string): Promise<MoodBoard | null> {
  try {
    const { data, error } = await supabase
      .from("mood_boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching mood board:", error);
    return null;
  }
}

// Create a new mood board
export async function createMoodBoard(
  board: Omit<MoodBoard, "id" | "created_at" | "updated_at">
): Promise<MoodBoard> {
  try {
    const { data, error } = await supabase
      .from("mood_boards")
      .insert([
        {
          ...board,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as MoodBoard;
  } catch (error) {
    console.error("Error creating mood board:", error);
    throw error;
  }
}

// Update a mood board
export async function updateMoodBoard(
  boardId: string,
  updates: Partial<MoodBoard>
): Promise<MoodBoard> {
  try {
    const { data, error } = await supabase
      .from("mood_boards")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boardId)
      .select()
      .single();

    if (error) throw error;
    return data as MoodBoard;
  } catch (error) {
    console.error("Error updating mood board:", error);
    throw error;
  }
}

// Delete a mood board
export async function deleteMoodBoard(boardId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("mood_boards")
      .delete()
      .eq("id", boardId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting mood board:", error);
    throw error;
  }
}

// Get all items for a mood board
export async function getMoodBoardItems(
  boardId: string
): Promise<MoodBoardItem[]> {
  try {
    const { data, error } = await supabase
      .from("mood_board_items")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MoodBoardItem[];
  } catch (error) {
    console.error("Error fetching mood board items:", error);
    throw error;
  }
}

// Add an item to a mood board
export async function addMoodBoardItem(
  item: Omit<MoodBoardItem, "id" | "created_at" | "updated_at">
): Promise<MoodBoardItem> {
  try {
    const { data, error } = await supabase
      .from("mood_board_items")
      .insert([
        {
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as MoodBoardItem;
  } catch (error) {
    console.error("Error adding mood board item:", error);
    throw error;
  }
}

// Update a mood board item
export async function updateMoodBoardItem(
  itemId: string,
  updates: Partial<MoodBoardItem>
): Promise<MoodBoardItem> {
  try {
    const { data, error } = await supabase
      .from("mood_board_items")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;
    return data as MoodBoardItem;
  } catch (error) {
    console.error("Error updating mood board item:", error);
    throw error;
  }
}

// Delete a mood board item
export async function deleteMoodBoardItem(itemId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("mood_board_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting mood board item:", error);
    throw error;
  }
}

// Share a mood board with another user
export async function shareMoodBoard(
  boardId: string,
  sharedBy: string,
  sharedWithId: string,
  permission: "view" | "edit" | "admin"
): Promise<MoodBoardShare> {
  try {
    const { data, error } = await supabase
      .from("mood_board_shares")
      .insert([
        {
          board_id: boardId,
          shared_by: sharedBy,
          shared_with_id: sharedWithId,
          permission,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as MoodBoardShare;
  } catch (error) {
    console.error("Error sharing mood board:", error);
    throw error;
  }
}

// Remove a share from a mood board
export async function removeMoodBoardShare(shareId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("mood_board_shares")
      .delete()
      .eq("id", shareId);

    if (error) throw error;
  } catch (error) {
    console.error("Error removing mood board share:", error);
    throw error;
  }
}

// Generate a shareable link for a mood board
export async function generateShareableLink(boardId: string): Promise<string> {
  // In a real app, this might generate a special token or use a URL shortener
  return `${window.location.origin}/mood-board/${boardId}`;
}

// Upload an image for a mood board
export async function uploadMoodBoardImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `mood-board-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export default {
  getMoodBoards,
  getMoodBoard,
  createMoodBoard,
  updateMoodBoard,
  deleteMoodBoard,
  getMoodBoardItems,
  addMoodBoardItem,
  updateMoodBoardItem,
  deleteMoodBoardItem,
  shareMoodBoard,
  removeMoodBoardShare,
  generateShareableLink,
  uploadMoodBoardImage,
};
