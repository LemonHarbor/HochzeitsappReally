export interface SongRequest {
  id: string;
  guest_id: string;
  guest_name?: string;
  title: string;
  artist: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at?: string;
}

export interface SongRequestFormData {
  title: string;
  artist: string;
  notes?: string;
}
