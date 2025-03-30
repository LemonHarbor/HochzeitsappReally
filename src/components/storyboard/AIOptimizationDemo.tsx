import React, { useState } from "react";
import AIOptimizationDialog from "../../../../src/components/table/AIOptimizationDialog";
import { Button } from "../../../../src/components/ui/button";
import { Wand2 } from "lucide-react";
import { ThemeProvider } from "../../../../src/lib/theme";
import { LanguageProvider } from "../../../../src/lib/language";

const AIOptimizationDemo = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 flex flex-col items-center justify-center gap-8 bg-background min-h-screen">
          <h1 className="text-2xl font-bold">AI Seating Optimization Demo</h1>
          <p className="text-muted-foreground max-w-md text-center">
            Click the button below to open the AI optimization dialog and see
            how it works.
          </p>

          <Button onClick={() => setShowDialog(true)}>
            <Wand2 className="mr-2 h-4 w-4" />
            Open AI Optimization Dialog
          </Button>

          <AIOptimizationDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            onOptimizationComplete={() => {
              console.log("Optimization complete!");
            }}
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AIOptimizationDemo;
