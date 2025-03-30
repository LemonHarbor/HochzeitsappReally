import React from "react";
import TimelineGenerator from "../../../../src/components/timeline/TimelineGenerator";
import { ThemeProvider } from "../../../../src/lib/theme";
import { LanguageProvider } from "../../../../src/lib/language";

const TimelineGeneratorDemo = () => {
  // Set initial wedding date to 9 months from now for demo purposes
  const initialWeddingDate = new Date();
  initialWeddingDate.setMonth(initialWeddingDate.getMonth() + 9);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-4 max-w-7xl mx-auto">
          <TimelineGenerator initialWeddingDate={initialWeddingDate} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default TimelineGeneratorDemo;
