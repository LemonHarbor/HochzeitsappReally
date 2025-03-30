import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/lib/language";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      // Hide the alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showAlert) return null;

  return (
    <Alert
      variant={isOnline ? "default" : "destructive"}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 z-50 shadow-lg transition-opacity duration-300"
    >
      {isOnline ? (
        <Wifi className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <AlertTitle>
        {isOnline
          ? language === "de"
            ? "Wieder online"
            : "Back Online"
          : language === "de"
            ? "Offline"
            : "Offline"}
      </AlertTitle>
      <AlertDescription>
        {isOnline
          ? language === "de"
            ? "Die Verbindung wurde wiederhergestellt."
            : "Connection has been restored."
          : language === "de"
            ? "Sie sind offline. Einige Funktionen sind möglicherweise eingeschränkt."
            : "You are offline. Some features may be limited."}
      </AlertDescription>
    </Alert>
  );
}
