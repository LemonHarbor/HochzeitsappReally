import { User } from '@supabase/supabase-js';

// Extend User type to include displayName
declare module '@supabase/supabase-js' {
  interface User {
    displayName?: string;
  }
}

export interface VendorData {
  id: string;
  name: string;
  category: string;
  contact: Record<string, string>; // Fixed to use Record type
  is_confirmed: boolean; // Fixed to use boolean instead of string
  notes?: string;
  created_at: string;
  updated_at: string;
}
