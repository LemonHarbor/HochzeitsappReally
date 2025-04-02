import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileLayout from "./MobileLayout";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

// Directly import the hook to avoid path resolution issues
// This is a workaround for Vercel deployment

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  // Use the hook with the media query
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
