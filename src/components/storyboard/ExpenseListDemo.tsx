import React from "react";
import ExpenseList from "../../../../src/components/budget/ExpenseList";

const ExpenseListDemo = () => {
  // Sample data for the demo
  const expenses = [
    {
      id: "exp1",
      name: "Venue Deposit",
      category: "Venue",
      amount: 2500,
      date: "2024-06-01",
      status: "paid",
      vendor: "Grand Plaza Hotel",
      notes: "Initial 25% deposit for wedding venue",
      receiptUrl: "/receipts/venue-deposit.pdf",
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
      receiptUrl: "/receipts/photo-deposit.pdf",
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

  const categories = [
    "Venue",
    "Catering",
    "Decoration",
    "Photography",
    "Videography",
    "Attire",
    "Beauty",
    "Transportation",
    "Entertainment",
    "Stationery",
    "Gifts",
    "Jewelry",
    "Other",
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <ExpenseList
        expenses={expenses}
        categories={categories}
        onAddExpense={() => {}}
        onEditExpense={() => {}}
        onDeleteExpense={() => {}}
        onViewReceipt={() => {}}
      />
    </div>
  );
};

export default ExpenseListDemo;
