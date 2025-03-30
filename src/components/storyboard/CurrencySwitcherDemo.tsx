import React from "react";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CurrencySwitcherDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 flex flex-col items-center justify-center gap-8 bg-background min-h-screen">
            <h1 className="text-2xl font-bold">Currency Switcher Demo</h1>
            <p className="text-muted-foreground max-w-md text-center">
              Click the currency icon to switch between USD and EUR
            </p>

            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Currency Switcher</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CurrencySwitcher />
              </CardContent>
            </Card>
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default CurrencySwitcherDemo;
