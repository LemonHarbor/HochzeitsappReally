// Create a hooks directory and add useAuth.ts
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => ({}),
  logout: async () => ({}), // Added missing logout method
  resetPassword: async () => ({}),
  updateProfile: async () => ({}),
  error: null
});

export const useAuth = () => useContext(AuthContext);

export default useAuth;
