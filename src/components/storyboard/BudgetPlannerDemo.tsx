import React from "react";
import BudgetPlanner from "../../../../src/components/budget/BudgetPlanner";

const BudgetPlannerDemo = () => {
  // Sample data for the demo
  const totalBudget = 20000;
  const categories = [
    {
      id: "venue",
      name: "Venue",
      percentage: 40,
      amount: 8000,
      spent: 7500,
      color: "#4f46e5",
      recommended: 40,
    },
    {
      id: "catering",
      name: "Catering",
      percentage: 25,
      amount: 5000,
      spent: 2800,
      color: "#0ea5e9",
      recommended: 25,
    },
    {
      id: "decoration",
      name: "Decoration",
      percentage: 10,
      amount: 2000,
      spent: 1200,
      color: "#10b981",
      recommended: 10,
    },
    {
      id: "photography",
      name: "Photography",
      percentage: 12.5,
      amount: 2500,
      spent: 500,
      color: "#f59e0b",
      recommended: 12.5,
    },
    {
      id: "attire",
      name: "Attire",
      percentage: 7.5,
      amount: 1500,
      spent: 350,
      color: "#ef4444",
      recommended: 7.5,
    },
    {
      id: "other",
      name: "Other",
      percentage: 5,
      amount: 1000,
      spent: 0,
      color: "#8b5cf6",
      recommended: 5,
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <BudgetPlanner
        totalBudget={totalBudget}
        categories={categories}
        onSaveBudget={(budget, categories) => {
          console.log("Budget saved:", budget, categories);
        }}
        onResetToRecommended={() => {
          console.log("Reset to recommended");
        }}
      />
    </div>
  );
};

export default BudgetPlannerDemo;
