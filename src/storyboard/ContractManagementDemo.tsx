import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractList from "@/components/vendor/ContractList";
import ContractForm from "@/components/vendor/ContractForm";
import ExpiringContractsAlert from "@/components/vendor/ExpiringContractsAlert";

const ContractManagementDemo = () => {
  // Sample contract data
  const sampleContracts = [
    {
      id: "contract-1",
      vendor_id: "vendor-1",
      name: "Venue Rental Agreement",
      file_url: "https://example.com/contracts/venue-agreement.pdf",
      file_type: "application/pdf",
      file_size: 2500000,
      signed_date: new Date(2024, 5, 15).toISOString(),
      expiration_date: new Date(2025, 5, 15).toISOString(),
      status: "active",
      key_terms: {
        "Rental Fee": "$5,000",
        Deposit: "$1,000",
        "Cancellation Policy": "60 days notice required",
      },
      notes: "Main venue contract for the wedding ceremony and reception.",
      created_at: new Date(2024, 5, 10).toISOString(),
    },
    {
      id: "contract-2",
      vendor_id: "vendor-1",
      name: "Catering Service Agreement",
      file_url: "https://example.com/contracts/catering-agreement.pdf",
      file_type: "application/pdf",
      file_size: 1800000,
      signed_date: new Date(2024, 6, 1).toISOString(),
      expiration_date: new Date(
        new Date().getTime() + 15 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 15 days from now
      status: "active",
      key_terms: {
        "Cost Per Person": "$85",
        "Minimum Guests": "100",
        "Menu Selection Deadline": "30 days before event",
      },
      notes:
        "Catering contract including appetizers, main course, and dessert.",
      created_at: new Date(2024, 6, 1).toISOString(),
    },
    {
      id: "contract-3",
      vendor_id: "vendor-1",
      name: "Photography Contract",
      file_url: "https://example.com/contracts/photography-contract.pdf",
      file_type: "application/pdf",
      file_size: 1200000,
      signed_date: new Date(2024, 6, 15).toISOString(),
      expiration_date: new Date(2025, 0, 15).toISOString(),
      status: "pending",
      key_terms: {
        "Package Price": "$3,500",
        "Hours of Coverage": "8 hours",
        "Delivery Timeline": "6-8 weeks after event",
      },
      created_at: new Date(2024, 6, 15).toISOString(),
    },
    {
      id: "contract-4",
      vendor_id: "vendor-1",
      name: "DJ Services Agreement",
      file_url: "https://example.com/contracts/dj-agreement.docx",
      file_type:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      file_size: 950000,
      status: "draft",
      created_at: new Date(2024, 7, 1).toISOString(),
    },
  ];

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <h1 className="text-2xl font-bold mb-6">
              Contract Management Demo
            </h1>
            <p className="text-muted-foreground mb-6">
              This demo shows the contract management functionality for wedding
              vendors. You can add, view, and manage vendor contracts with
              expiration tracking and key terms.
            </p>

            <ExpiringContractsAlert
              onViewContract={(url) => window.open(url, "_blank")}
              daysThreshold={30}
            />

            <Tabs defaultValue="contracts">
              <TabsList className="mb-6">
                <TabsTrigger value="contracts">Contract List</TabsTrigger>
                <TabsTrigger value="form">Contract Form</TabsTrigger>
              </TabsList>

              <TabsContent value="contracts">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Contracts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContractList
                      contracts={sampleContracts}
                      onViewContract={(url) => window.open(url, "_blank")}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="form">
                <Card>
                  <CardHeader>
                    <CardTitle>Add/Edit Contract</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContractForm
                      vendorId="vendor-1"
                      initialData={{
                        name: "",
                        status: "draft",
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default ContractManagementDemo;
