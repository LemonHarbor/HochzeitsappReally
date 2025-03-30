import React from "react";
import ExpenseForm from "@/components/budget/ExpenseForm";

const ExpenseFormDemo = () => {
  // Sample initial data for the form
  const initialData = {
    name: "Venue Deposit",
    category: "Venue",
    amount: 2500,
    date: new Date("2024-06-01"),
    status: "paid",
    vendor: "Grand Plaza Hotel",
    notes: "Initial 25% deposit for wedding venue",
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <ExpenseForm
        initialData={initialData}
        isEditing={true}
        onSubmit={(data, receipt) => {
          console.log("Form submitted:", data, receipt);
        }}
        onCancel={() => {
          console.log("Form cancelled");
        }}
      />
    </div>
  );
};

export default ExpenseFormDemo;
