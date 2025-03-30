import React from "react";
import QuickActions from "../../../../src/components/dashboard/QuickActions";
import { ThemeProvider } from "../../../../src/lib/theme";
import { LanguageProvider } from "../../../../src/lib/language";
import { AuthProvider } from "../../../../src/context/AuthContext";

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
