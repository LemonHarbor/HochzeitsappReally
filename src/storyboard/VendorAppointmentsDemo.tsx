import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";
import VendorAppointments from "@/components/vendor/VendorAppointments";

const VendorAppointmentsDemo = () => {
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
            <VendorAppointments
              vendor={sampleVendor}
              onBack={() => console.log("Back clicked")}
            />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default VendorAppointmentsDemo;
