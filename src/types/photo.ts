export interface Photo {
  id: string;
  user_id: string;
  album_id?: string | null;
  url: string;
  thumbnail_url?: string | null;
  title?: string | null;
  description?: string | null;
  tags?: string[] | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhotoComment {
  id: string;
  photo_id: string;
  guest_id: string;
  guest_name?: string;
  content: string;
  created_at: string;
  updated_at?: string | null;
}

export interface PhotoLike {
  id: string;
  photo_id: string;
  guest_id: string;
  created_at: string;
}

export interface PhotoAlbum {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  cover_photo_id?: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
