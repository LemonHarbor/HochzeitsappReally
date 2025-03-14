import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface RealtimeIndicatorProps {
  className?: string;
}

export function RealtimeIndicator({ className }: RealtimeIndicatorProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [hasActivity, setHasActivity] = useState(false);

  useEffect(() => {
    // Check initial connection status
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from("guests")
          .select("id", { count: "exact", head: true });
        setIsConnected(!error);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();

    // Set up realtime subscription to monitor connection
    const channel = supabase
      .channel("connection-status")
      .on("presence", { event: "sync" }, () => {
        setIsConnected(true);
      })
      .on("presence", { event: "join" }, () => {
        setIsConnected(true);
      })
      .on("presence", { event: "leave" }, () => {
        // Only set disconnected if we don't rejoin quickly
        setTimeout(() => {
          checkConnection();
        }, 2000);
      })
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        // Show activity indicator
        setHasActivity(true);
        setTimeout(() => setHasActivity(false), 1000);
      })
      .subscribe();

    // Cleanup
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors",
        isConnected ? "text-green-500" : "text-red-500",
        hasActivity && "bg-green-100 dark:bg-green-900/20",
        className,
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span className="hidden sm:inline">Realtime</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span className="hidden sm:inline">Offline</span>
        </>
      )}
    </div>
  );
}
