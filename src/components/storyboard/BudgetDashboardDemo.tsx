import React from "react";
import BudgetDashboard from "../../../../src/components/budget/BudgetDashboard";

const BudgetDashboardDemo = () => {
  // Sample data for the demo
  const totalBudget = 20000;
  const totalSpent = 12350;
  const categories = [
    { name: "Venue", allocated: 8000, spent: 7500, color: "#4f46e5" },
    { name: "Catering", allocated: 5000, spent: 2800, color: "#0ea5e9" },
    { name: "Decoration", allocated: 2000, spent: 1200, color: "#10b981" },
    { name: "Photography", allocated: 2500, spent: 500, color: "#f59e0b" },
    { name: "Attire", allocated: 1500, spent: 350, color: "#ef4444" },
    { name: "Other", allocated: 1000, spent: 0, color: "#8b5cf6" },
  ];
  const recentExpenses = [
    {
      id: "exp1",
      name: "Venue Deposit",
      category: "Venue",
      amount: 2500,
      date: "2024-06-01",
      status: "paid",
      vendor: "Grand Plaza Hotel",
    },
    {
      id: "exp2",
      name: "Catering Deposit",
      category: "Catering",
      amount: 1000,
      date: "2024-06-05",
      status: "paid",
      vendor: "Elite Catering",
    },
    {
      id: "exp3",
      name: "Photographer Booking",
      category: "Photography",
      amount: 500,
      date: "2024-06-10",
      status: "paid",
      vendor: "MemoryMakers Photography",
    },
    {
      id: "exp4",
      name: "Floral Arrangements",
      category: "Decoration",
      amount: 800,
      date: "2024-06-15",
      status: "pending",
      vendor: "Blooming Beauties",
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <BudgetDashboard
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        categories={categories}
        recentExpenses={recentExpenses}
        onAddExpense={() => {}}
        onViewAllExpenses={() => {}}
        onExportBudget={() => {}}
      />
    </div>
  );
};

export default BudgetDashboardDemo;
