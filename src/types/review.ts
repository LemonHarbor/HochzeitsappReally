export interface Review {
  id: string;
  vendor_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  visit_date?: Date | string;
  status?: ReviewStatus;
  moderation_notes?: string;
  moderated_by?: string;
  moderated_at?: string;
  created_at?: string;
  updated_at?: string;
  helpful_votes?: number;
  unhelpful_votes?: number;
  is_verified?: boolean;
  verification_type?: VerificationType;
  verification_date?: string;
}

export type VerificationType = "purchase" | "booking" | "contract" | "admin";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewFormData {
  vendor_id: string;
  rating: number;
  review_text: string;
  visit_date?: Date | string;
  status?: ReviewStatus;
  is_verified?: boolean;
  verification_type?: VerificationType;
  verification_date?: string;
}

export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at?: string;
}
