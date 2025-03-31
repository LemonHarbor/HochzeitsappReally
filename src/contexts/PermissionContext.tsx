import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PermissionContextType, PermissionCheckResult } from '@/types/permissions';
import { PermissionRole } from '@/types/permissionRole';
import { checkUserPermission, getUserRole as getRole } from '@/services/permissionService';
import { useAuth } from '@/hooks/useAuth';

// Create the context
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Check if the current user has permission for a resource
  const checkPermission = async (
    resourceId: string,
    resourceType: 'jga' | 'wedding_homepage',
    requiredRole: PermissionRole = 'viewer'
  ): Promise<PermissionCheckResult> => {
    if (!user) {
      return { hasPermission: false };
    }

    setIsLoading(true);
    try {
      const hasPermission = await checkUserPermission(
        user.id,
        resourceId,
        resourceType,
        requiredRole
      );
      
      const role = await getRole(user.id, resourceId, resourceType);
      
      return { hasPermission, role };
    } catch (error) {
      console.error('Error checking permission:', error);
      return { hasPermission: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Get the current user's role for a resource
  const getUserRole = async (
    resourceId: string,
    resourceType: 'jga' | 'wedding_homepage'
  ): Promise<PermissionRole | null> => {
    if (!user) {
      return null;
    }

    setIsLoading(true);
    try {
      return await getRole(user.id, resourceId, resourceType);
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    checkPermission,
    getUserRole,
    isLoading
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook to use the permission context
export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
