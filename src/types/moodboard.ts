export interface MoodBoard {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_public: boolean;
  cover_image_url?: string;
  // Add missing properties used in MoodBoardCanvas.tsx
  shared?: boolean;
  permission?: string;
}

export interface MoodBoardItem {
  id: string;
  board_id: string;
  image_url: string;
  title: string;
  description: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
  color?: string;
  tags?: string[];
  // Add missing properties used in MoodBoardCanvas.tsx
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
  filter?: string;
  user_id?: string;
}

export interface MoodBoardComment {
  id: string;
  board_id: string;
  item_id?: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface MoodBoardFormData {
  name: string;
  description: string;
  is_public: boolean;
  cover_image_url?: string;
}

export interface MoodBoardItemFormData {
  image_url: string;
  title: string;
  description: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  color?: string;
  tags?: string[];
}
