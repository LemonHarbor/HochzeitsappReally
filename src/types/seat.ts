export interface Seat {
  id: string;
  table_id: string;
  guest_id?: string;
  position: { x: number; y: number };
  created_at: string;
  updated_at: string;
}
