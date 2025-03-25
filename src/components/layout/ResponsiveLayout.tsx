import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileLayout from "./MobileLayout";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {isMobile ? (
        <MobileLayout>{children}</MobileLayout>
      ) : (
        // Return children directly for desktop layout
        // The existing layout components will handle desktop view
        <>{children}</>
      )}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </>
  );
};

export default ResponsiveLayout;
