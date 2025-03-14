export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: "family" | "friend" | "colleague" | "other";
  rsvp_status: "confirmed" | "pending" | "declined";
  dietary_restrictions?: string;
  plus_one: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}
