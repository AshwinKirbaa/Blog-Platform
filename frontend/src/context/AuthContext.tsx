import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { AuthService } from "../services/blogService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("blog_auth_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const storedToken = localStorage.getItem("blog_auth_token");
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await AuthService.getMe();
      setUser(userData);
      setToken(storedToken);
    } catch (err) {
      console.warn("Session expired or invalid, clearing local auth token.");
      localStorage.removeItem("blog_auth_token");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);
    localStorage.setItem("blog_auth_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await AuthService.register(name, email, password);
    localStorage.setItem("blog_auth_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("blog_auth_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (localStorage.getItem("blog_auth_token")) {
      await fetchCurrentUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
