export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number; // Made required
  spent: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardBudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
  amount: number; // Added missing property
}

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  status: "pending" | "cancelled" | "paid"; // Fixed to use union type instead of string
  vendor: string;
  created_at: string;
  updated_at: string;
}
