import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Download,
  Upload,
  FileText,
  FileJson,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  HelpCircle,
} from "lucide-react";
import {
  importGuests,
  downloadGuestsAsCSV,
  downloadGuestsAsJSON,
  downloadGuestsAsExcel,
  downloadCSVTemplate,
} from "@/services/importExportService";

interface ImportExportGuestsProps {
  onImportComplete?: () => void;
}

const ImportExportGuests: React.FC<ImportExportGuestsProps> = ({
  onImportComplete = () => {},
}) => {
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported: number;
    errors: string[];
  } | null>(null);

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  // Handle import process
  const handleImport = async () => {
    if (!importFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a CSV file to import.",
      });
      return;
    }

    if (!importFile.name.toLowerCase().endsWith(".csv")) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please select a CSV file.",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(10);

    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csvData = event.target?.result as string;
          setImportProgress(30);

          // Import the guests
          const result = await importGuests(csvData);
          setImportProgress(100);
          setImportResult(result);

          if (result.success) {
            toast({
              title: "Import Successful",
              description: `Successfully imported ${result.imported} guests.${result.errors.length > 0 ? " Some entries had errors." : ""}`,
            });

            // Notify parent component that import is complete
            if (result.imported > 0) {
              onImportComplete();
            }
          } else {
            toast({
              variant: "destructive",
              title: "Import Failed",
              description:
                "Failed to import guests. Please check the file format.",
            });
          }
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast({
            variant: "destructive",
            title: "Import Failed",
            description:
              error.message || "An error occurred while processing the file.",
          });
          setImportResult({
            success: false,
            imported: 0,
            errors: [error.message],
          });
        } finally {
          setIsImporting(false);
        }
      };

      reader.onerror = () => {
        setIsImporting(false);
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: "Failed to read the file. Please try again.",
        });
      };

      reader.readAsText(importFile);
    } catch (error) {
      setIsImporting(false);
      toast({
        variant: "destructive",
        title: "Import Error",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  // Handle export actions
  const handleExport = async (format: "csv" | "json" | "excel") => {
    try {
      switch (format) {
        case "csv":
          await downloadGuestsAsCSV();
          break;
        case "json":
          await downloadGuestsAsJSON();
          break;
        case "excel":
          await downloadGuestsAsExcel();
          break;
      }

      toast({
        title: "Export Successful",
        description: `Guest list has been exported as ${format.toUpperCase()}.`,
      });

      setShowExportDialog(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error.message || "Failed to export guest list.",
      });
    }
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    try {
      downloadCSVTemplate();
      toast({
        title: "Template Downloaded",
        description: "CSV import template has been downloaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download template.",
      });
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => setShowImportDialog(true)}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          Import Guests
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowExportDialog(true)}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Guests
        </Button>
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Guests</DialogTitle>
            <DialogDescription>
              Upload a CSV file with guest information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isImporting && !importResult && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label
                  htmlFor="guest-csv"
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload CSV file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {importFile ? importFile.name : "CSV files only"}
                  </p>
                  <input
                    id="guest-csv"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="text-xs"
                  >
                    <HelpCircle className="mr-1 h-3 w-3" />
                    Download Template
                  </Button>

                  <div className="text-xs text-muted-foreground">
                    Max file size: 5MB
                  </div>
                </div>
              </div>
            )}

            {isImporting && (
              <div className="space-y-2">
                <p className="text-sm text-center">Importing guests...</p>
                <Progress value={importProgress} className="h-2" />
              </div>
            )}

            {importResult && (
              <div className="space-y-4">
                <Alert
                  variant={importResult.success ? "default" : "destructive"}
                >
                  {importResult.success ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {importResult.success
                      ? "Import Successful"
                      : "Import Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {importResult.success
                      ? `Successfully imported ${importResult.imported} guests.`
                      : "Failed to import guests. Please check the file format."}
                  </AlertDescription>
                </Alert>

                {importResult.errors.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    <p className="text-sm font-medium mb-1">Errors:</p>
                    <ul className="text-xs space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index} className="text-destructive">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportFile(null);
                      setImportResult(null);
                    }}
                  >
                    Import Another File
                  </Button>
                  <Button
                    onClick={() => setShowImportDialog(false)}
                    variant={importResult.success ? "default" : "outline"}
                  >
                    {importResult.success ? "Done" : "Close"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!isImporting && !importResult && (
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importFile}
                className="flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Guest List</DialogTitle>
            <DialogDescription>
              Choose a format to export your guest list.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="csv" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="excel">Excel</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    CSV Format
                  </CardTitle>
                  <CardDescription>
                    Standard CSV format compatible with most spreadsheet
                    applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Exports all guest data in a comma-separated values format.
                    Ideal for general use and data processing.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleExport("csv")}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="excel" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel Format
                  </CardTitle>
                  <CardDescription>
                    Optimized for Microsoft Excel and other spreadsheet
                    applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Exports guest data in a format that opens correctly in Excel
                    with proper character encoding and formatting.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleExport("excel")}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download for Excel
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="json" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileJson className="mr-2 h-4 w-4" />
                    JSON Format
                  </CardTitle>
                  <CardDescription>
                    Structured data format for developers and data integration.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Exports guest data as a JSON array. Useful for developers or
                    for importing into other applications and databases.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleExport("json")}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportExportGuests;
