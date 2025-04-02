export interface Photo {
  id: string;
  title: string;
  url: string;
  caption: string; // Added missing caption property
  description?: string;
  is_public: boolean;
  event_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface JGAPhoto {
  id: string;
  title: string;
  url: string; // Added missing url property
  description: string;
  is_public: boolean;
  event_id: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}
