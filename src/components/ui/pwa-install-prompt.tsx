import React, { useState, useEffect } from "react";
import { Button } from "../../../../src/components/ui/button";
import { Download, X } from "lucide-react";
import { Card, CardContent } from "../../../../src/components/ui/card";
import { useLanguage } from "../../../../src/lib/language";
import { isPWA } from "../../../../src/lib/mobile-utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Don't show install prompt if already in PWA mode
    if (isPWA()) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the browser's install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;

    // User accepted the install
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the saved prompt as it can't be used again
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">
            {language === "de" ? "Als App installieren" : "Install as App"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={dismissPrompt}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {language === "de"
            ? "Installieren Sie den Hochzeitsplaner auf Ihrem Gerät für schnelleren Zugriff und Offline-Funktionen."
            : "Install the Wedding Planner on your device for faster access and offline features."}
        </p>
        <Button className="w-full" onClick={handleInstallClick} size="sm">
          <Download className="mr-2 h-4 w-4" />
          {language === "de" ? "Jetzt installieren" : "Install Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
