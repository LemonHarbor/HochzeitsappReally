import { PermissionRole } from "@/types/permissionRole";

// Type definitions for the permission system
export interface UserPermission {
  id?: string;
  resource_id: string;
  resource_type: 'jga' | 'wedding_homepage';
  user_id?: string;
  user_email: string;
  role: PermissionRole;
  is_accepted: boolean;
  created_at?: string;
  updated_at?: string;
}

// Permission check result
export interface PermissionCheckResult {
  hasPermission: boolean;
  role?: PermissionRole;
}

// Permission context for React context API
export interface PermissionContextType {
  checkPermission: (resourceId: string, resourceType: 'jga' | 'wedding_homepage') => Promise<PermissionCheckResult>;
  getUserRole: (resourceId: string, resourceType: 'jga' | 'wedding_homepage') => Promise<PermissionRole | null>;
  isLoading: boolean;
}
