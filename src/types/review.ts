export interface Review {
  id: string;
  vendor_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewFormData {
  vendor_id: string;
  rating: number;
  review_text: string;
}
