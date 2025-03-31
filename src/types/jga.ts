export interface JGAEvent {
  id?: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  organizer_id: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JGADateOption {
  id?: string;
  event_id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JGADateVote {
  id?: string;
  date_option_id: string;
  participant_id: string;
  vote: 'yes' | 'maybe' | 'no';
  created_at?: string;
  updated_at?: string;
}

export interface JGABudgetItem {
  id?: string;
  event_id: string;
  title: string;
  description?: string;
  amount: number;
  paid_by?: string;
  split_type: 'equal' | 'custom' | 'individual';
  created_at?: string;
  updated_at?: string;
}

export interface JGABudgetSplit {
  id?: string;
  budget_item_id: string;
  participant_id: string;
  amount: number;
  is_paid: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JGAActivity {
  id?: string;
  event_id: string;
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  cost_per_person?: number;
  created_at?: string;
  updated_at?: string;
}

export interface JGATask {
  id?: string;
  event_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export interface JGASurpriseIdea {
  id?: string;
  event_id: string;
  title: string;
  description?: string;
  created_by: string;
  is_approved: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JGAParticipant {
  id?: string;
  event_id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  is_organizer: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JGAPhoto {
  id?: string;
  event_id: string;
  uploaded_by: string;
  url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}
