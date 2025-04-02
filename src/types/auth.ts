import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  logout: () => Promise<any>; // Added missing logout method
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
  error: string | null;
}
