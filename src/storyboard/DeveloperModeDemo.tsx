import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";
import { DeveloperMode } from "@/components/ui/developer-mode";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const DeveloperModeDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <Card>
              <CardHeader>
                <CardTitle>Developer Mode</CardTitle>
                <CardDescription>
                  Switch between different user roles to access all areas of the
                  application.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <DeveloperMode />
              </CardContent>
            </Card>
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default DeveloperModeDemo;
