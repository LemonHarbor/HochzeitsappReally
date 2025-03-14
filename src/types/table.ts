export interface Table {
  id: string;
  name: string;
  shape: "round" | "rectangle" | "custom";
  capacity: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
  created_at: string;
  updated_at: string;
}
