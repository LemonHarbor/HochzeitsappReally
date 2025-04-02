// tests/auth.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../src/composables/useAuth';
import { supabase } from '../src/lib/supabase';

// Mock Supabase
vi.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn()
          }
        }
      }))
    }
  }
}));

describe('useAuth composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in a user with valid credentials', async () => {
    // Mock successful sign in
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }
      },
      error: null
    });

    const { signIn } = useAuth();
    const result = await signIn('test@example.com', 'password123');

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
  });

  it('should handle sign in errors', async () => {
    // Mock failed sign in
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: null },
      error: {
        message: 'Invalid login credentials',
        status: 400
      }
    });

    const { signIn } = useAuth();
    const result = await signIn('wrong@example.com', 'wrongpassword');

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });
    expect(result.error).toBeDefined();
    expect(result.error.message).toBe('Invalid login credentials');
  });

  it('should sign up a new user', async () => {
    // Mock successful sign up
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: {
        user: {
          id: 'new-user-id',
          email: 'new@example.com'
        },
        session: null
      },
      error: null
    });

    const { signUp } = useAuth();
    const result = await signUp('new@example.com', 'newpassword123');

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'newpassword123',
      options: {
        emailRedirectTo: expect.any(String)
      }
    });
    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
  });

  it('should sign out a user', async () => {
    // Mock successful sign out
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null
    });

    const { signOut } = useAuth();
    const result = await signOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.error).toBeNull();
  });
});
