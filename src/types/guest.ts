import { User } from '@supabase/supabase-js';

export interface GuestFormData {
  firstName: string; // Made required
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  rsvpStatus?: "confirmed" | "pending" | "declined";
  plusOne?: boolean;
  dietaryRestrictions?: string;
  notes?: string;
}

export interface GuestRelationship {
  id: string;
  guest_id: string;
  related_guest_id: string;
  relationship_type: "couple" | "friend" | "family" | "conflict"; // Fixed to use union type
  strength: number;
  created_at: string;
  updated_at: string;
}
