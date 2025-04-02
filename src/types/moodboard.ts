export interface MoodBoard {
  id: string;
  user_id: string;
  title: string; // Added missing property
  category: string; // Added missing property
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MoodBoardItem {
  id: string;
  board_id: string;
  user_id: string;
  image_url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  title: string; // Added missing property
  description: string; // Added missing property
  height: number; // Added missing property
  width: number; // Added missing property
  z_index: number; // Added missing property
  type: string; // Added missing property
  created_at: string;
  updated_at: string;
}

export interface MoodBoardShare {
  id: string;
  board_id: string;
  user_id: string;
  shared_with_email: string;
  permission_level: "view" | "edit" | "admin";
  is_accepted: boolean; // Added missing property
  created_at: string;
  updated_at: string;
}
