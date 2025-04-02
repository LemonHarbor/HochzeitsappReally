export interface ContractKeyTerms {
  [key: string]: string;
}

export interface Contract {
  id: string;
  vendor_id: string;
  name: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  signed_date?: string;
  expiration_date?: string;
  status: "draft" | "pending" | "active" | "expired" | "cancelled";
  key_terms?: ContractKeyTerms;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
