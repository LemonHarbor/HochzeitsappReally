export interface MoodBoard {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MoodBoardItem {
  id: string;
  board_id: string;
  user_id: string;
  image_url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  filter?: string;
  caption?: string;
  created_at: string;
  updated_at?: string;
}

export interface MoodBoardComment {
  id: string;
  board_id: string;
  item_id?: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface MoodBoardShare {
  id: string;
  board_id: string;
  user_id: string;
  shared_with_id: string;
  permission: "view" | "edit" | "admin";
  created_at: string;
  updated_at?: string;
}
