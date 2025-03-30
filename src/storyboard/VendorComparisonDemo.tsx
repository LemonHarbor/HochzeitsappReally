import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";
import VendorComparisonTool from "@/components/vendor/VendorComparisonTool";

const VendorComparisonDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <VendorComparisonTool
              onBack={() => console.log("Back clicked")}
              onViewVendorDetail={(vendor) =>
                console.log("View vendor details", vendor)
              }
            />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default VendorComparisonDemo;
