import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";
import VendorDetail from "@/components/vendor/VendorDetail";

const VendorDetailDemo = () => {
  // Sample vendor data
  const sampleVendor = {
    id: "vendor-1",
    name: "Grand Plaza Hotel",
    category: "venue",
    contact_name: "John Smith",
    email: "contact@grandplaza.com",
    phone: "+1 (555) 123-4567",
    website: "https://www.grandplaza.com",
    address: "123 Main Street, Anytown, USA",
    notes:
      "Beautiful venue with excellent service. Offers both indoor and outdoor ceremony options.",
    status: "active",
    created_at: new Date().toISOString(),
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <VendorDetail
              vendor={sampleVendor}
              onBack={() => console.log("Back clicked")}
              onEdit={(vendor) => console.log("Edit clicked", vendor)}
              onDelete={(id) => console.log("Delete clicked", id)}
              onAddExpense={() => console.log("Add expense clicked")}
              onViewExpenses={() => console.log("View expenses clicked")}
              onViewDetailedReport={() => console.log("View report clicked")}
              onViewReceipt={(url) => console.log("View receipt clicked", url)}
            />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default VendorDetailDemo;
