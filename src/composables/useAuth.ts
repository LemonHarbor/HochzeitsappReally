import { ref, reactive, computed, onMounted, watch } from 'vue';
import { supabase } from '../lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';

export function useAuth() {
  const session = ref<Session | null>(null);
  const user = ref<User | null>(null);
  const loading = ref(true);
  const authError = ref<AuthError | null>(null);
  const authState = reactive({
    isAuthenticated: false,
    isAuthenticating: false,
    isRegistering: false,
    lastActivity: null as Date | null,
  });

  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email || '');
  const userMetadata = computed(() => user.value?.user_metadata || {});

  // Initialize auth state
  onMounted(async () => {
    try {
      loading.value = true;
      
      // Get initial session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        session.value = data.session;
        user.value = data.session.user;
        authState.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      authError.value = error as AuthError;
    } finally {
      loading.value = false;
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        session.value = currentSession;
        user.value = currentSession?.user ?? null;
        authState.isAuthenticated = !!currentSession;
        authState.lastActivity = new Date();
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', currentSession?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery initiated');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    // Clean up subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  });

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      authState.isAuthenticating = true;
      authError.value = null;
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      authError.value = error as AuthError;
      return { data: null, error };
    } finally {
      authState.isAuthenticating = false;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      authState.isRegistering = true;
      authError.value = null;
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      authError.value = error as AuthError;
      return { data: null, error };
    } finally {
      authState.isRegistering = false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      authError.value = null;
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      authError.value = error as AuthError;
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      authError.value = null;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      authError.value = error as AuthError;
      return { data: null, error };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      authError.value = null;
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      authError.value = error as AuthError;
      return { data: null, error };
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    if (!user.value) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: any) => {
    if (!user.value) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error };
    }
  };

  // Get error message
  const getErrorMessage = (error: AuthError | null) => {
    if (!error) return '';
    
    // Map common error codes to user-friendly messages
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.';
      case 'Email not confirmed':
        return 'Bitte bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden.';
      case 'Password should be at least 6 characters':
        return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
      case 'User already registered':
        return 'Diese E-Mail-Adresse ist bereits registriert.';
      default:
        return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
    }
  };

  return {
    // State
    session,
    user,
    loading,
    authError,
    authState,
    
    // Computed
    isAuthenticated,
    userEmail,
    userMetadata,
    
    // Methods
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    getUserProfile,
    updateUserProfile,
    getErrorMessage
  };
}
