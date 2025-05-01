import { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { User } from '../types/user';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes, we'll simulate API calls with localStorage
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      const response = await api.auth.login(email, password);
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      const response = await api.auth.register(name, email, password);
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    // Clear local storage and state
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  }, []);
  
  const checkAuth = useCallback(() => {
    try {
      setLoading(true);
      
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);
  
  const isAuthenticated = useMemo(() => Boolean(user), [user]);
  
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  }), [user, isAuthenticated, loading, error, login, register, logout, checkAuth]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};