export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
  vendor?: string;
  notes?: string;
  receipt_url?: string;
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  spent: number;
  color: string;
  recommended: number;
}

export interface DashboardBudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}
