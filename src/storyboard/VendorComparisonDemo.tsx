import React from "react";
import { ThemeProvider } from "../../../src/lib/theme";
import { LanguageProvider } from "../../../src/lib/language";
import { CurrencyProvider } from "../../../src/lib/currency";
import VendorComparisonTool from "../../../src/components/vendor/VendorComparisonTool";

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
