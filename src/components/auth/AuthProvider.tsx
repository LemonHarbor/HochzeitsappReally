import React, { useState, useEffect } from "react";
import {
  AuthContext,
  User,
  Permissions,
  rolePermissions,
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  UserRole,
} from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Get default permissions for guests
  const [permissions, setPermissions] = useState<Permissions>(
    rolePermissions.guest,
  );

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Update permissions based on user role
        if (currentUser) {
          setPermissions(rolePermissions[currentUser.role]);
        } else {
          setPermissions(rolePermissions.guest);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      setPermissions(rolePermissions[loggedInUser.role]);
      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedInUser.name}!`,
      });
    } catch (err) {
      console.error("Login error:", err);
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: (err as Error).message,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => {
    try {
      setIsLoading(true);
      const newUser = await registerUser(email, password, name, role);
      setUser(newUser);
      setPermissions(rolePermissions[newUser.role]);
      toast({
        title: "Registration successful",
        description: `Welcome, ${newUser.name}!`,
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: (err as Error).message,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setPermissions(rolePermissions.guest);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (err) {
      console.error("Logout error:", err);
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
