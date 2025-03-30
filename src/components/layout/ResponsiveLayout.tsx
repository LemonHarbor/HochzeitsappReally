import React from "react";
import { useMediaQuery } from "../../../../src/hooks/useMediaQuery";
import MobileLayout from "./MobileLayout";
import { PWAInstallPrompt } from "../../../../src/components/ui/pwa-install-prompt";
import { OfflineIndicator } from "../../../../src/components/ui/offline-indicator";

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
