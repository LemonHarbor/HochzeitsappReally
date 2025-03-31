export interface MoodBoardShare {
  id: string;
  board_id: string;
  user_id: string;
  shared_with_email: string;
  permission_level: 'view' | 'edit';
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface MoodBoardShareFormData {
  board_id: string;
  shared_with_email: string;
  permission_level: 'view' | 'edit';
}
