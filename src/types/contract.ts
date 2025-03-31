export interface Contract {
  id: string;
  vendor_id: string;
  name: string;
  file_url: string;
  status: ContractStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';

export interface ContractFormData {
  name: string;
  file_url: string;
  status: ContractStatus;
  notes: string;
  vendor_id?: string;
}
