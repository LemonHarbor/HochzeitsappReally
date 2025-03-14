import React from "react";
import TimelineGenerator from "@/components/timeline/TimelineGenerator";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { AuthProvider } from "@/context/AuthContext";

const TimelineExportDemo = () => {
  // Set initial wedding date to 6 months from now for demo purposes
  const initialWeddingDate = new Date();
  initialWeddingDate.setMonth(initialWeddingDate.getMonth() + 6);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Timeline Export Demo</h1>
            <p className="text-muted-foreground mb-6">
              This demo shows the TimelineGenerator component with the new
              export functionality. Click the "Export" button to download your
              timeline as a CSV file.
            </p>
            <TimelineGenerator initialWeddingDate={initialWeddingDate} />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default TimelineExportDemo;
