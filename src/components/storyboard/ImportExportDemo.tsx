import React from "react";
import ImportExportGuests from "@/components/guest/ImportExportGuests";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImportExportDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Guest Import/Export Demo</h1>
          <p className="text-muted-foreground mb-6">
            This demo shows the functionality for importing guests from CSV
            files and exporting the guest list to various formats.
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Import/Export Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportExportGuests
                onImportComplete={() => {
                  console.log("Import completed");
                }}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Import guests from CSV files</li>
                  <li>Validate data during import</li>
                  <li>Download CSV template for proper formatting</li>
                  <li>Handle duplicate entries by updating existing guests</li>
                  <li>Detailed error reporting for failed imports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Export to standard CSV format</li>
                  <li>Export to Excel-compatible CSV (with BOM)</li>
                  <li>Export to JSON for developers</li>
                  <li>All guest data included in exports</li>
                  <li>Proper encoding for international characters</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default ImportExportDemo;
