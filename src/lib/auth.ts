import { createContext, useContext } from "react";
import { supabase } from "./supabase";

// Define user roles
export type UserRole = "couple" | "bestMan" | "maidOfHonor" | "guest";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Define permissions for each role
export interface Permissions {
  canViewGuests: boolean;
  canEditGuests: boolean;
  canDeleteGuests: boolean;
  canViewTables: boolean;
  canEditTables: boolean;
  canDeleteTables: boolean;
  canManagePermissions: boolean;
  canSendInvites: boolean;
  canExportData: boolean;
}

// Role-based permissions
export const rolePermissions: Record<UserRole, Permissions> = {
  couple: {
    canViewGuests: true,
    canEditGuests: true,
    canDeleteGuests: true,
    canViewTables: true,
    canEditTables: true,
    canDeleteTables: true,
    canManagePermissions: true,
    canSendInvites: true,
    canExportData: true,
  },
  bestMan: {
    canViewGuests: true,
    canEditGuests: true,
    canDeleteGuests: false,
    canViewTables: true,
    canEditTables: true,
    canDeleteTables: false,
    canManagePermissions: false,
    canSendInvites: true,
    canExportData: false,
  },
  maidOfHonor: {
    canViewGuests: true,
    canEditGuests: true,
    canDeleteGuests: false,
    canViewTables: true,
    canEditTables: true,
    canDeleteTables: false,
    canManagePermissions: false,
    canSendInvites: true,
    canExportData: false,
  },
  guest: {
    canViewGuests: false,
    canEditGuests: false,
    canDeleteGuests: false,
    canViewTables: false,
    canEditTables: false,
    canDeleteTables: false,
    canManagePermissions: false,
    canSendInvites: false,
    canExportData: false,
  },
};

// Auth context
export interface AuthContextType {
  user: User | null;
  permissions: Permissions;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

// Helper function to check if a user has a specific permission
export const hasPermission = (
  user: User | null,
  permission: keyof Permissions,
): boolean => {
  if (!user) return false;
  return rolePermissions[user.role][permission];
};

// Auth functions
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Fetch user profile from the database
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) throw profileError;

  return {
    id: data.user.id,
    email: data.user.email!,
    name: profileData.name,
    role: profileData.role as UserRole,
    avatar: profileData.avatar_url,
  };
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole,
): Promise<User> => {
  // Register the user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Create a profile in the users table
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .insert([
      {
        id: data.user?.id,
        email,
        name,
        role,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, "")}`,
      },
    ])
    .select()
    .single();

  if (profileError) throw profileError;

  return {
    id: data.user!.id,
    email,
    name,
    role,
    avatar: profileData.avatar_url,
  };
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  // Fetch user profile
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) return null;

  return {
    id: data.user.id,
    email: data.user.email!,
    name: profileData.name,
    role: profileData.role as UserRole,
    avatar: profileData.avatar_url,
  };
};
