import React from "react";
import VendorManager from "@/components/vendor/VendorManager";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";

const VendorManagementDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <h1 className="text-2xl font-bold mb-6">Vendor Management Demo</h1>
            <p className="text-muted-foreground mb-6">
              This demo shows the vendor management functionality. You can add,
              edit, and delete vendors, as well as view expenses associated with
              each vendor.
            </p>
            <VendorManager />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default VendorManagementDemo;
