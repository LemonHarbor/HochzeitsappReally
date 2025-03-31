// This file fixes the circular import issue
// by re-exporting the PermissionRole type

export type PermissionRole = 'owner' | 'admin' | 'editor' | 'viewer';
