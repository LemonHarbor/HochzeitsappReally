import React from "react";
import BudgetForm from "@/components/budget/BudgetForm";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";

const BudgetFormDemo = () => {
  // Sample initial data for the form
  const initialData = {
    name: "Venue",
    amount: 8000,
    percentage: 40,
    color: "#4f46e5",
    recommended: 40,
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Budget Form Demo</h1>
          <BudgetForm
            initialData={initialData}
            isEditing={true}
            totalBudget={20000}
            onSubmit={(data) => {
              console.log("Form submitted:", data);
            }}
            onCancel={() => {
              console.log("Form cancelled");
            }}
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default BudgetFormDemo;
