import React from "react";
import QuickActions from "@/components/dashboard/QuickActions";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { AuthProvider } from "@/context/AuthContext";

const QuickActionsDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="p-4 max-w-7xl mx-auto">
            <QuickActions />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default QuickActionsDemo;
