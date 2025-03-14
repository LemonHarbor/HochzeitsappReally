import React, { useState } from "react";
import { useDeveloperMode } from "@/lib/developer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Database, Settings, Bug, Wrench, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function DeveloperPanel() {
  const { isDeveloperMode } = useDeveloperMode();
  const [activeTab, setActiveTab] = useState("general");
  const [logs, setLogs] = useState<string[]>([]);
  const [showMockData, setShowMockData] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [enableSlowNetwork, setEnableSlowNetwork] = useState(false);

  // Only render if developer mode is enabled
  if (!isDeveloperMode) return null;

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("Logs cleared");
  };

  const refreshCache = () => {
    addLog("Cache refreshed");
    // Implementation would clear any app caches
  };

  const resetLocalStorage = () => {
    localStorage.clear();
    addLog("Local storage cleared");
  };

  const testSupabaseConnection = async () => {
    try {
      addLog("Testing Supabase connection...");
      const { data, error } = await supabase.from("guests").select("count()");
      if (error) throw error;
      addLog(`Connection successful! Found ${data[0]?.count || 0} guests.`);
    } catch (error) {
      addLog(`Connection error: ${error.message}`);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-background shadow-md flex items-center gap-2"
        >
          <Wrench className="h-4 w-4" />
          <span>Dev Tools</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Entwicklermodus
          </SheetTitle>
          <SheetDescription>
            Entwicklertools und Debugging-Funktionen
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Allgemein</TabsTrigger>
              <TabsTrigger value="database">Datenbank</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mock-data">Mock-Daten anzeigen</Label>
                    <div className="text-xs text-muted-foreground">
                      Zeigt Testdaten anstelle von echten Daten an
                    </div>
                  </div>
                  <Switch
                    id="mock-data"
                    checked={showMockData}
                    onCheckedChange={setShowMockData}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-info">Debug-Informationen</Label>
                    <div className="text-xs text-muted-foreground">
                      Zeigt zusätzliche Debug-Informationen in der UI an
                    </div>
                  </div>
                  <Switch
                    id="debug-info"
                    checked={showDebugInfo}
                    onCheckedChange={setShowDebugInfo}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="slow-network">
                      Langsames Netzwerk simulieren
                    </Label>
                    <div className="text-xs text-muted-foreground">
                      Verzögert API-Anfragen, um langsame Verbindungen zu
                      simulieren
                    </div>
                  </div>
                  <Switch
                    id="slow-network"
                    checked={enableSlowNetwork}
                    onCheckedChange={setEnableSlowNetwork}
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={refreshCache}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Cache leeren
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetLocalStorage}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    LocalStorage zurücksetzen
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Supabase-Verbindung</h3>
                  <Badge variant="outline" className="ml-2">
                    {import.meta.env.VITE_SUPABASE_URL
                      ? "Konfiguriert"
                      : "Nicht konfiguriert"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="project-id" className="text-xs">
                        Projekt-ID
                      </Label>
                      <Input
                        id="project-id"
                        value={import.meta.env.SUPABASE_PROJECT_ID || ""}
                        readOnly
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="anon-key" className="text-xs">
                        Anon Key
                      </Label>
                      <Input
                        id="anon-key"
                        value={
                          import.meta.env.VITE_SUPABASE_ANON_KEY ? "*****" : ""
                        }
                        readOnly
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={testSupabaseConnection}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Verbindung testen
                  </Button>
                </div>

                <div className="pt-2 space-y-2">
                  <h3 className="text-sm font-medium">Datenbank-Aktionen</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addLog("Seed data function would run here")
                      }
                    >
                      Testdaten einfügen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addLog("Reset data function would run here")
                      }
                    >
                      Daten zurücksetzen
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Entwickler-Logs</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLogs}
                  disabled={logs.length === 0}
                >
                  Logs löschen
                </Button>
              </div>

              <ScrollArea className="h-[300px] w-full rounded-md border p-2">
                {logs.length > 0 ? (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className="text-xs font-mono whitespace-pre-wrap"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    <Bug className="mr-2 h-4 w-4" />
                    Keine Logs vorhanden
                  </div>
                )}
              </ScrollArea>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => addLog("Test log message")}
                >
                  Test-Log hinzufügen
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Schließen</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
