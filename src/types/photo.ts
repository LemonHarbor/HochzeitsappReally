export interface Photo {
  id: string;
  user_id: string;
  guest_id?: string;
  url: string;
  caption?: string;
  created_at: string;
  updated_at?: string;
}

export interface PhotoComment {
  id: string;
  photo_id: string;
  guest_id: string;
  guest_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}
