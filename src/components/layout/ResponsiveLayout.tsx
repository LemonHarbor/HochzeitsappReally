import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileLayout from "./MobileLayout";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  // Return children directly for desktop layout
  // The existing layout components will handle desktop view
  return <>{children}</>;
};

export default ResponsiveLayout;
