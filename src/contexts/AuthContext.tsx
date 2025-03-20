
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/types";

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("flexiwork_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, firstName: string, lastName: string) => {
    // For now, we'll just simulate a login process
    // In a real application, you would authenticate with a backend
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
    };
    
    setUser(newUser);
    localStorage.setItem("flexiwork_user", JSON.stringify(newUser));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("flexiwork_user");
  };

  // Value object that will be provided to consumers of this context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
