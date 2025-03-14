export interface Payment {
  id: string;
  vendor_id: string;
  amount: number;
  payment_date: string;
  due_date: string;
  status: "paid" | "pending" | "cancelled";
  payment_type: "deposit" | "installment" | "final";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentFormData {
  vendor_id: string;
  amount: number;
  payment_date?: string;
  due_date: string;
  status: "paid" | "pending" | "cancelled";
  payment_type: "deposit" | "installment" | "final";
  notes?: string;
}
