import { supabase } from '@/lib/supabaseClient';
import { UserPermission } from '@/types/permissions';
import { PermissionRole } from '@/types/permissionRole';

/**
 * Get all permissions for a specific resource
 */
export const getUserPermissions = async (
  resourceId: string,
  resourceType: 'jga' | 'wedding_homepage'
): Promise<UserPermission[]> => {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .eq('resource_id', resourceId)
    .eq('resource_type', resourceType);

  if (error) {
    console.error('Error fetching permissions:', error);
    throw new Error('Failed to fetch permissions');
  }

  return data || [];
};

/**
 * Get a user's permission for a specific resource
 */
export const getUserPermission = async (
  userId: string,
  resourceId: string,
  resourceType: 'jga' | 'wedding_homepage'
): Promise<UserPermission | null> => {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .eq('user_id', userId)
    .eq('resource_id', resourceId)
    .eq('resource_type', resourceType)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
    console.error('Error fetching user permission:', error);
    throw new Error('Failed to fetch user permission');
  }

  return data || null;
};

/**
 * Get a user's permission by email for a specific resource
 */
export const getUserPermissionByEmail = async (
  email: string,
  resourceId: string,
  resourceType: 'jga' | 'wedding_homepage'
): Promise<UserPermission | null> => {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .eq('user_email', email)
    .eq('resource_id', resourceId)
    .eq('resource_type', resourceType)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user permission by email:', error);
    throw new Error('Failed to fetch user permission');
  }

  return data || null;
};

/**
 * Create a new permission
 */
export const createUserPermission = async (
  permission: Omit<UserPermission, 'id' | 'created_at' | 'updated_at' | 'is_accepted'>
): Promise<UserPermission> => {
  // Check if permission already exists
  const existingPermission = await getUserPermissionByEmail(
    permission.user_email,
    permission.resource_id,
    permission.resource_type
  );

  if (existingPermission) {
    throw new Error('Permission already exists for this user');
  }

  const { data, error } = await supabase
    .from('permissions')
    .insert({
      ...permission,
      is_accepted: false // New permissions are not accepted by default
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating permission:', error);
    throw new Error('Failed to create permission');
  }

  return data;
};

/**
 * Update an existing permission
 */
export const updateUserPermission = async (
  permissionId: string,
  updates: Partial<UserPermission>
): Promise<UserPermission> => {
  const { data, error } = await supabase
    .from('permissions')
    .update(updates)
    .eq('id', permissionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating permission:', error);
    throw new Error('Failed to update permission');
  }

  return data;
};

/**
 * Delete a permission
 */
export const deleteUserPermission = async (permissionId: string): Promise<void> => {
  const { error } = await supabase
    .from('permissions')
    .delete()
    .eq('id', permissionId);

  if (error) {
    console.error('Error deleting permission:', error);
    throw new Error('Failed to delete permission');
  }
};

/**
 * Accept a permission invitation
 */
export const acceptPermissionInvitation = async (permissionId: string): Promise<UserPermission> => {
  const { data, error } = await supabase
    .from('permissions')
    .update({ is_accepted: true })
    .eq('id', permissionId)
    .select()
    .single();

  if (error) {
    console.error('Error accepting permission invitation:', error);
    throw new Error('Failed to accept permission invitation');
  }

  return data;
};

/**
 * Check if a user has permission for a resource
 */
export const checkUserPermission = async (
  userId: string,
  resourceId: string,
  resourceType: 'jga' | 'wedding_homepage',
  requiredRole: PermissionRole = 'viewer'
): Promise<boolean> => {
  const permission = await getUserPermission(userId, resourceId, resourceType);
  
  if (!permission || !permission.is_accepted) {
    return false;
  }

  // Role hierarchy: owner > admin > editor > viewer
  const roleHierarchy: Record<PermissionRole, number> = {
    owner: 4,
    admin: 3,
    editor: 2,
    viewer: 1
  };

  return roleHierarchy[permission.role] >= roleHierarchy[requiredRole];
};

/**
 * Get a user's role for a resource
 */
export const getUserRole = async (
  userId: string,
  resourceId: string,
  resourceType: 'jga' | 'wedding_homepage'
): Promise<PermissionRole | null> => {
  const permission = await getUserPermission(userId, resourceId, resourceType);
  
  if (!permission || !permission.is_accepted) {
    return null;
  }

  return permission.role;
};
