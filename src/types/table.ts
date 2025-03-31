export interface Table {
  id: string;
  name: string;
  capacity: number;
  shape: 'round' | 'rectangle' | 'square' | 'oval';
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  rotation: number;
  group_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TableGroup {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TableGuest {
  id: string;
  table_id: string;
  guest_id: string;
  seat_number?: number;
  created_at: string;
  updated_at: string;
}

export interface TableFormData {
  name: string;
  capacity: number;
  shape: 'round' | 'rectangle' | 'square' | 'oval';
  group_id?: string;
}
