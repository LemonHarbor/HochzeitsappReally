import React from "react";
import TimelineGenerator from "../../../../src/components/timeline/TimelineGenerator";
import { ThemeProvider } from "../../../../src/lib/theme";
import { LanguageProvider } from "../../../../src/lib/language";
import { AuthProvider } from "../../../../src/context/AuthContext";

const TimelineIntegrationDemo = () => {
  // Set initial wedding date to 9 months from now for demo purposes
  const initialWeddingDate = new Date();
  initialWeddingDate.setMonth(initialWeddingDate.getMonth() + 9);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
              Timeline Integration Demo
            </h1>
            <p className="text-muted-foreground mb-6">
              This demo shows the TimelineGenerator component with database
              integration. Changes to the timeline are saved to the database and
              can be loaded when you return.
            </p>
            <TimelineGenerator initialWeddingDate={initialWeddingDate} />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default TimelineIntegrationDemo;
