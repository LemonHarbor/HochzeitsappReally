import React from "react";
import { ThemeProvider } from "../../../src/lib/theme";
import { LanguageProvider } from "../../../src/lib/language";
import { CurrencyProvider } from "../../../src/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import VendorStatusBadge from "../../../src/components/vendor/VendorStatusBadge";
import VendorStatusSelect from "../../../src/components/vendor/VendorStatusSelect";

const VendorStatusManagementDemo = () => {
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

  const [vendorStatus, setVendorStatus] = React.useState<
    "active" | "pending" | "inactive"
  >("active");

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <h1 className="text-2xl font-bold mb-6">
              Vendor Status Management Demo
            </h1>
            <p className="text-muted-foreground mb-6">
              This demo shows the vendor status management functionality. You
              can view and change vendor statuses with visual indicators.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Status Badges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium">Small:</span>
                      <VendorStatusBadge status="active" size="sm" />
                      <VendorStatusBadge status="pending" size="sm" />
                      <VendorStatusBadge status="inactive" size="sm" />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium">Medium:</span>
                      <VendorStatusBadge status="active" size="md" />
                      <VendorStatusBadge status="pending" size="md" />
                      <VendorStatusBadge status="inactive" size="md" />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium">Large:</span>
                      <VendorStatusBadge status="active" size="lg" />
                      <VendorStatusBadge status="pending" size="lg" />
                      <VendorStatusBadge status="inactive" size="lg" />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium">
                        No Indicator:
                      </span>
                      <VendorStatusBadge
                        status="active"
                        showIndicator={false}
                      />
                      <VendorStatusBadge
                        status="pending"
                        showIndicator={false}
                      />
                      <VendorStatusBadge
                        status="inactive"
                        showIndicator={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendor Status Selector</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        Current Status:
                      </span>
                      <VendorStatusBadge status={vendorStatus} size="lg" />
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        Change Status:
                      </span>
                      <VendorStatusSelect
                        vendor={{ ...sampleVendor, status: vendorStatus }}
                        onStatusChange={(newStatus) => {
                          setVendorStatus(
                            newStatus as "active" | "pending" | "inactive",
                          );
                        }}
                      />
                    </div>

                    <div className="p-4 bg-muted/20 rounded-md mt-4">
                      <p className="text-sm text-muted-foreground">
                        Note: In a real implementation, this would update the
                        vendor status in the database. For this demo, we're just
                        updating the local state.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default VendorStatusManagementDemo;
