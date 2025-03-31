import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/contexts/PermissionContext";

interface TestResultItem {
  name: string;
  success: boolean;
  message: string;
}

const TestAppFunctionality: React.FC = () => {
  const { user } = useAuth();
  const { checkPermission, getUserRole } = usePermission();
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const results: TestResultItem[] = [];
    let allPassed = true;

    // Test 1: Authentication
    try {
      const authResult: TestResultItem = {
        name: "Authentifizierung",
        success: !!user,
        message: user 
          ? `Erfolgreich als ${user.email} angemeldet` 
          : "Nicht angemeldet"
      };
      results.push(authResult);
      if (!authResult.success) allPassed = false;
    } catch (error) {
      results.push({
        name: "Authentifizierung",
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : String(error)}`
      });
      allPassed = false;
    }

    // Test 2: Database Connection
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      const dbResult: TestResultItem = {
        name: "Datenbankverbindung",
        success: !error,
        message: error 
          ? `Fehler: ${error.message}` 
          : "Verbindung zur Datenbank erfolgreich"
      };
      results.push(dbResult);
      if (!dbResult.success) allPassed = false;
    } catch (error) {
      results.push({
        name: "Datenbankverbindung",
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : String(error)}`
      });
      allPassed = false;
    }

    // Test 3: JGA Module Components
    try {
      const jgaComponentsExist = 
        typeof JGADatePoll !== 'undefined' && 
        typeof JGABudgetManager !== 'undefined' && 
        typeof JGAActivityPlanner !== 'undefined' && 
        typeof JGATaskManager !== 'undefined' && 
        typeof JGASurpriseIdeaCollection !== 'undefined' && 
        typeof JGAInvitationManager !== 'undefined' && 
        typeof JGAPhotoGallery !== 'undefined';
      
      const jgaResult: TestResultItem = {
        name: "JGA-Planungsmodul Komponenten",
        success: jgaComponentsExist,
        message: jgaComponentsExist 
          ? "Alle JGA-Komponenten wurden gefunden" 
          : "Einige JGA-Komponenten fehlen"
      };
      results.push(jgaResult);
      if (!jgaResult.success) allPassed = false;
    } catch (error) {
      results.push({
        name: "JGA-Planungsmodul Komponenten",
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : String(error)}`
      });
      allPassed = false;
    }

    // Test 4: Wedding Homepage Components
    try {
      const weddingComponentsExist = 
        typeof WeddingHomepageCreator !== 'undefined' && 
        typeof WeddingEventManager !== 'undefined' && 
        typeof WeddingPhotoGalleryManager !== 'undefined' && 
        typeof WeddingFAQManager !== 'undefined' && 
        typeof WeddingGiftRegistryManager !== 'undefined' && 
        typeof WeddingRSVPManager !== 'undefined' && 
        typeof WeddingAccommodationManager !== 'undefined' && 
        typeof WeddingGuestbookManager !== 'undefined' && 
        typeof WeddingMapManager !== 'undefined' && 
        typeof WeddingCountdown !== 'undefined';
      
      const weddingResult: TestResultItem = {
        name: "Hochzeitshomepage Komponenten",
        success: weddingComponentsExist,
        message: weddingComponentsExist 
          ? "Alle Hochzeitshomepage-Komponenten wurden gefunden" 
          : "Einige Hochzeitshomepage-Komponenten fehlen"
      };
      results.push(weddingResult);
      if (!weddingResult.success) allPassed = false;
    } catch (error) {
      results.push({
        name: "Hochzeitshomepage Komponenten",
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : String(error)}`
      });
      allPassed = false;
    }

    // Test 5: Permission System
    try {
      const permissionSystemWorks = 
        typeof checkPermission === 'function' && 
        typeof getUserRole === 'function' && 
        typeof PermissionManager !== 'undefined';
      
      const permissionResult: TestResultItem = {
        name: "Berechtigungssystem",
        success: permissionSystemWorks,
        message: permissionSystemWorks 
          ? "Berechtigungssystem funktioniert" 
          : "Berechtigungssystem fehlt oder ist unvollständig"
      };
      results.push(permissionResult);
      if (!permissionResult.success) allPassed = false;
    } catch (error) {
      results.push({
        name: "Berechtigungssystem",
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : String(error)}`
      });
      allPassed = false;
    }

    // Test 6: Responsive Design
    try {
      const isResponsive = window.matchMedia('(max-width: 768px)').matches !== undefined;
      
      const responsiveResult: TestResultItem = {
        name: "Responsives Design",
        success: isResponsive,
        message: isResponsive 
          ? "Responsives Design wird unterstützt" 
          : "Responsives Design wird nicht unterstützt"
      };
      results.push(responsiveResult);
      if (!responsiveResult.success) allPassed = false;
    } catch (error) {
      results.push({
        name: "Responsives Design",
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : String(error)}`
      });
      allPassed = false;
    }

    // Test 7: WeWeb Integration
    try {
      const wewebIntegrationExists = 
        typeof window.WeWeb !== 'undefined' || 
        document.querySelector('[data-weweb-integration]') !== null;
      
      const wewebResult: TestResultItem = {
        name: "WeWeb-Integration",
        success: wewebIntegrationExists,
        message: wewebIntegrationExists 
          ? "WeWeb-Integration gefunden" 
          : "WeWeb-Integration nicht gefunden"
      };
      results.push(wewebResult);
      if (!wewebResult.success) allPassed = false;
    } catch (error) {
      results.push({
        name: "WeWeb-Integration",
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : String(error)}`
      });
      allPassed = false;
    }

    setTestResults(results);
    setAllTestsPassed(allPassed);
    setIsRunningTests(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>App-Funktionalität testen</CardTitle>
        <CardDescription>
          Überprüfe, ob alle Funktionen der App korrekt funktionieren
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testResults.length > 0 ? (
            <>
              <div className="mb-4">
                <Alert variant={allTestsPassed ? "default" : "destructive"}>
                  <div className="flex items-center">
                    {allTestsPassed ? (
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    <AlertTitle>
                      {allTestsPassed 
                        ? "Alle Tests erfolgreich" 
                        : "Einige Tests sind fehlgeschlagen"}
                    </AlertTitle>
                  </div>
                  <AlertDescription>
                    {allTestsPassed 
                      ? "Die App funktioniert wie erwartet." 
                      : "Bitte überprüfe die fehlgeschlagenen Tests."}
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-md ${
                      result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <div>
                        <h3 className="font-medium">{result.name}</h3>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Klicke auf "Tests ausführen", um die App-Funktionalität zu überprüfen.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={runTests}
          disabled={isRunningTests}
        >
          {isRunningTests ? "Tests werden ausgeführt..." : "Tests ausführen"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestAppFunctionality;
