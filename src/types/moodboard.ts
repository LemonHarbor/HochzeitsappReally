export interface MoodBoard {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_public: boolean;
  cover_image_url?: string;
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
}

export interface MoodBoardComment {
  id: string;
  board_id: string;
  item_id?: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
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
