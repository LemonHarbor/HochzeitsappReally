import React from "react";
import GuestRelationships from "../../../../src/components/guest/GuestRelationships";
import { ThemeProvider } from "../../../../src/lib/theme";
import { LanguageProvider } from "../../../../src/lib/language";

const RelationshipDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background">
          <h1 className="text-2xl font-bold mb-6">Guest Relationships Demo</h1>
          <p className="text-muted-foreground mb-6">
            This demo shows how to manage relationships between guests for
            better seating optimization.
          </p>
          <GuestRelationships />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default RelationshipDemo;
