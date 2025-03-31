export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  total_expenses?: number;
  paid_expenses?: number;
  pending_expenses?: number;
}

export interface VendorFormData {
  name: string;
  category: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  notes?: string | null;
  status?: string | null;
}
