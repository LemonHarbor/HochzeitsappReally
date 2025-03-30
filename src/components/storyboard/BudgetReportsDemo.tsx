import React from "react";
import BudgetReports from "../../../../src/components/budget/BudgetReports";
import { ThemeProvider } from "../../../../src/lib/theme";
import { LanguageProvider } from "../../../../src/lib/language";
import { CurrencyProvider } from "../../../../src/lib/currency";

const BudgetReportsDemo = () => {
  // Sample data for demonstration
  const sampleExpenses = [
    {
      id: "exp1",
      name: "Venue Deposit",
      category: "Venue",
      amount: 2500,
      date: "2024-06-01",
      status: "paid",
      vendor: "Grand Plaza Hotel",
      notes: "Initial 25% deposit for wedding venue",
    },
    {
      id: "exp2",
      name: "Catering Deposit",
      category: "Catering",
      amount: 1000,
      date: "2024-06-05",
      status: "paid",
      vendor: "Elite Catering",
      notes: "Deposit for 100 guests, includes appetizers and main course",
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
    {
      id: "exp5",
      name: "Wedding Dress",
      category: "Attire",
      amount: 1200,
      date: "2024-06-20",
      status: "paid",
      vendor: "Elegant Bridal",
    },
    {
      id: "exp6",
      name: "DJ Services",
      category: "Entertainment",
      amount: 800,
      date: "2024-06-25",
      status: "pending",
      vendor: "Rhythm Masters",
    },
    {
      id: "exp7",
      name: "Wedding Cake",
      category: "Catering",
      amount: 400,
      date: "2024-07-01",
      status: "pending",
      vendor: "Sweet Delights Bakery",
    },
    {
      id: "exp8",
      name: "Wedding Rings",
      category: "Jewelry",
      amount: 1500,
      date: "2024-07-05",
      status: "paid",
      vendor: "Forever Jewelers",
    },
    {
      id: "exp9",
      name: "Venue Final Payment",
      category: "Venue",
      amount: 7500,
      date: "2024-07-15",
      status: "pending",
      vendor: "Grand Plaza Hotel",
    },
    {
      id: "exp10",
      name: "Transportation",
      category: "Transportation",
      amount: 600,
      date: "2024-07-20",
      status: "pending",
      vendor: "Luxury Limos",
    },
  ];

  const sampleCategories = [
    { name: "Venue", allocated: 10000, spent: 10000, color: "#4f46e5" },
    { name: "Catering", allocated: 5000, spent: 1400, color: "#0ea5e9" },
    { name: "Decoration", allocated: 2000, spent: 800, color: "#10b981" },
    { name: "Photography", allocated: 2500, spent: 500, color: "#f59e0b" },
    { name: "Attire", allocated: 1500, spent: 1200, color: "#ef4444" },
    { name: "Entertainment", allocated: 1000, spent: 800, color: "#8b5cf6" },
    { name: "Jewelry", allocated: 2000, spent: 1500, color: "#ec4899" },
    { name: "Transportation", allocated: 800, spent: 600, color: "#14b8a6" },
  ];

  const totalBudget = 25000;
  const totalSpent = 16800;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <h1 className="text-2xl font-bold mb-6">
              Budget Reports & Analytics Demo
            </h1>
            <p className="text-muted-foreground mb-6">
              This demo shows the budget reporting and analytics functionality.
              It displays visual charts and analytics about spending patterns,
              budget vs. actual spending, and category breakdowns.
            </p>
            <BudgetReports
              expenses={sampleExpenses}
              categories={sampleCategories}
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              onExportReport={() =>
                alert(
                  "Export report functionality would download a CSV in a real implementation",
                )
              }
            />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default BudgetReportsDemo;
