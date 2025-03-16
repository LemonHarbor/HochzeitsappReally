export interface Review {
  id: string;
  vendor_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  status?: ReviewStatus;
  moderation_notes?: string;
  moderated_by?: string;
  moderated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewFormData {
  vendor_id: string;
  rating: number;
  review_text: string;
  status?: ReviewStatus;
}
