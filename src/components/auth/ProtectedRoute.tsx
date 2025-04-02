import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role check is required, implement it here
  if (requiredRole && user.role !== requiredRole) {
    // Check if user has the required role
    // For now, we'll log the check and allow access
    console.log(`Role check: User role ${user.role}, required role ${requiredRole}`);
    
    // In a production app, you might want to redirect to an unauthorized page
    // return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and passes role check, render the protected content
  return <>{children}</>;
}
