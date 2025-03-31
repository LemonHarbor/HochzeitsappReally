export interface GuestRelationship {
  id: string;
  guest_id: string;
  related_guest_id: string;
  relationship_type: "couple" | "friend" | "family" | "conflict" | string;
  strength: number;
  created_at: string;
  updated_at: string;
}
