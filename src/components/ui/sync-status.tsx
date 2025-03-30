import React, { useState, useEffect } from "react";
import { Check, RefreshCw, AlertCircle } from "lucide-react";
import { Badge } from "../../../../src/components/ui/badge";
import { useLanguage } from "../../../../src/lib/language";

type SyncStatus = "synced" | "syncing" | "error";

interface SyncStatusProps {
  className?: string;
}

export function SyncStatus({ className }: SyncStatusProps) {
  const [status, setStatus] = useState<SyncStatus>("synced");
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();

  // This is a mock implementation. In a real app, you would connect this
  // to your actual data synchronization logic.
  useEffect(() => {
    // Listen for custom events from your sync logic
    const handleSyncStart = () => {
      setStatus("syncing");
      setVisible(true);
    };

    const handleSyncComplete = () => {
      setStatus("synced");
      setVisible(true);
      // Hide the indicator after 2 seconds
      setTimeout(() => setVisible(false), 2000);
    };

    const handleSyncError = () => {
      setStatus("error");
      setVisible(true);
    };

    window.addEventListener("sync-start", handleSyncStart);
    window.addEventListener("sync-complete", handleSyncComplete);
    window.addEventListener("sync-error", handleSyncError);

    return () => {
      window.removeEventListener("sync-start", handleSyncStart);
      window.removeEventListener("sync-complete", handleSyncComplete);
      window.removeEventListener("sync-error", handleSyncError);
    };
  }, []);

  if (!visible) return null;

  return (
    <Badge
      variant={status === "error" ? "destructive" : "outline"}
      className={`flex items-center gap-1 ${className}`}
    >
      {status === "syncing" && <RefreshCw className="h-3 w-3 animate-spin" />}
      {status === "synced" && <Check className="h-3 w-3 text-green-500" />}
      {status === "error" && <AlertCircle className="h-3 w-3" />}
      <span>
        {status === "syncing" &&
          (language === "de" ? "Synchronisiere..." : "Syncing...")}
        {status === "synced" &&
          (language === "de" ? "Synchronisiert" : "Synced")}
        {status === "error" &&
          (language === "de" ? "Sync-Fehler" : "Sync Error")}
      </span>
    </Badge>
  );
}
