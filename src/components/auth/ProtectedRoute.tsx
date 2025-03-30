import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../context/AuthContext";
import { useDeveloperMode } from "../../lib/developer";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof Permissions;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const auth = useAuth();
  const { isDeveloperMode } = useDeveloperMode();
  const isAuthenticated = auth?.isAuthenticated || false;
  const isLoading = auth?.isLoading || false;
  const permissions = auth?.permissions || {};
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If developer mode is enabled, bypass permission checks
  if (isDeveloperMode && auth.user?.role === "developer") {
    return <>{children}</>;
  }

  // If a specific permission is required, check if the user has it
  if (requiredPermission && !permissions[requiredPermission]) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold text-destructive mb-2">
          Access Denied
        </h1>
        <p className="text-center text-muted-foreground mb-4">
          You don't have permission to access this page.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  // If authenticated and has permission, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
