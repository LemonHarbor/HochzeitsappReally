import React from "react";
import { ThemeProvider } from "../../../src/lib/theme";
import { LanguageProvider } from "../../../src/lib/language";
import { CurrencyProvider } from "../../../src/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../src/components/ui/tabs";
import VendorManager from "../../../src/components/vendor/VendorManager";
import ExpenseForm from "../../../src/components/budget/ExpenseForm";

const VendorExpenseIntegrationDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <h1 className="text-2xl font-bold mb-6">
              Vendor-Budget Integration Demo
            </h1>
            <p className="text-muted-foreground mb-6">
              This demo shows the integration between the vendor management
              system and budget tracking. Expenses can be associated with
              specific vendors, and spending can be tracked by vendor.
            </p>

            <Tabs defaultValue="vendors">
              <TabsList className="mb-6">
                <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
                <TabsTrigger value="expense">
                  Add Expense with Vendor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vendors">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendors with Expense Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VendorManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="expense">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Expense with Vendor Association</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExpenseForm />
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

export default VendorExpenseIntegrationDemo;
