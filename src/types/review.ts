export interface Review {
  id: string;
  vendor_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  is_verified: boolean;
  verification_type?: VerificationType;
  visit_date: string | Date;
  created_at: string;
  updated_at: string;
  helpful_votes?: number;
  unhelpful_votes?: number;
  status?: ReviewStatus;
}

export type VerificationType = 'receipt' | 'contract' | 'photo' | 'other' | 'purchase' | 'booking' | 'admin';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewFormData {
  rating: number;
  review_text: string;
  is_verified: boolean;
  verification_type?: VerificationType;
  visit_date: Date;
}

export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  vote_type: 'helpful' | 'not_helpful';
  created_at: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number;
  };
}

export interface FilterOptions {
  verificationType: VerificationType | 'all' | 'booking';
  showVerifiedOnly: boolean;
  ratings: number[];
  searchTerm: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}
