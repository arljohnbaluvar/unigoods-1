import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';

interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  role: 'user' | 'admin';
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; university: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'unigoods_auth';

// Mock admin user
const mockAdmin: User = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@unigoods.com',
  university: 'STI College Tagum',
  role: 'admin',
  isVerified: true,
};

// Mock regular user
const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'user@example.com',
  university: 'STI College Tagum',
  role: 'user',
  isVerified: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Mock authentication
      if (email === 'admin@unigoods.com' && password === 'admin123') {
        setUser(mockAdmin);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAdmin));
      } else if (email === 'user@example.com' && password === 'user123') {
        setUser(mockUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; university: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Mock registration
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        university: data.university,
        role: 'user',
        isVerified: false,
      };

      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    enqueueSnackbar('Successfully logged out', { variant: 'success' });
  }, [enqueueSnackbar]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 