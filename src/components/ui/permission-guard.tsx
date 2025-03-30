import React from "react";
import { useAuth, Permissions } from "@/context/AuthContext";
import { useDeveloperMode } from "@/lib/developer";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: keyof Permissions;
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallback,
}) => {
  const auth = useAuth();
  const { isDeveloperMode } = useDeveloperMode();

  // Check if auth context is available and has permissions
  if (!auth || !auth.permissions) {
    return fallback ? <>{fallback}</> : null;
  }

  // If developer mode is enabled and user is a developer, always render children
  if (isDeveloperMode && auth.user?.role === "developer") {
    return <>{children}</>;
  }

  if (auth.permissions[requiredPermission]) {
    return <>{children}</>;
  }

  // Return fallback if provided, otherwise null
  return fallback ? <>{fallback}</> : null;
};
