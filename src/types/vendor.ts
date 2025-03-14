export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  notes?: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at?: string;
  total_expenses?: number;
  paid_expenses?: number;
  pending_expenses?: number;
}

export interface VendorFormData {
  name: string;
  category: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  notes?: string;
  status?: "active" | "inactive" | "pending";
}
