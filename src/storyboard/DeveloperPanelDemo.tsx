import React from "react";
import { ThemeProvider } from "../../../src/lib/theme";
import { LanguageProvider } from "../../../src/lib/language";
import { CurrencyProvider } from "../../../src/lib/currency";
import { DeveloperPanel } from "../../../src/components/ui/developer-panel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../src/components/ui/card";

const DeveloperPanelDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <Card>
              <CardHeader>
                <CardTitle>Developer Panel</CardTitle>
                <CardDescription>
                  Switch between different user roles to access all areas of the
                  application, including guest accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <DeveloperPanel />
              </CardContent>
            </Card>
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default DeveloperPanelDemo;
