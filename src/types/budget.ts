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
  allocated?: number; // Added to match BudgetReports.tsx interface
}

export interface DashboardBudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
  amount: number; // Added this property to fix errors in BudgetDashboard.tsx
}
