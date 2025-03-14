export interface Contract {
  id: string;
  vendor_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  signed_date?: string;
  expiration_date?: string;
  status: "draft" | "pending" | "active" | "expired" | "cancelled";
  key_terms?: Record<string, string>;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContractFormData {
  vendor_id: string;
  name: string;
  signed_date?: string;
  expiration_date?: string;
  status: "draft" | "pending" | "active" | "expired" | "cancelled";
  key_terms?: Record<string, string>;
  notes?: string;
}
