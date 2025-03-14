export interface GuestRelationship {
  id: string;
  guest_id: string;
  related_guest_id: string;
  relationship_type: "family" | "couple" | "friend" | "conflict";
  strength: number; // 1-10 scale
  created_at: string;
  updated_at: string;
}

export interface RelationshipFormData {
  guest_id: string;
  related_guest_id: string;
  relationship_type: "family" | "couple" | "friend" | "conflict";
  strength: number;
}
