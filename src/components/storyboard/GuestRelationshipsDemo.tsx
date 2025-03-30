import React from "react";
import GuestRelationships from "@/components/guest/GuestRelationships";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";

const GuestRelationshipsDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Guest Relationships</h1>
          <p className="text-muted-foreground mb-6">
            Define relationships between guests to improve AI seating
            optimization. Specify relationship types (family, couple, friend,
            conflict) and strength to help create better seating arrangements.
          </p>
          <GuestRelationships />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default GuestRelationshipsDemo;
