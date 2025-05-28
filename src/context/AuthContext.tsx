import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  university?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: { name: string; email: string; password: string; university: string }) => Promise<void>;
  logout: () => void;
}

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@unigoods.com',
  password: 'admin123',
};

const ADMIN_USER: User = {
  id: 'admin-1',
  email: ADMIN_CREDENTIALS.email,
  name: 'Admin User',
  role: 'admin',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login logic
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        university: 'Stanford University',
        role: 'user' as const,
      };
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (formData: { name: string; email: string; password: string; university: string }) => {
    // Mock registration logic
    if (formData.email && formData.password) {
      const mockUser: User = {
        id: '1',
        name: formData.name,
        email: formData.email,
        university: formData.university,
        role: 'user' as const,
      };
      setUser(mockUser);
    } else {
      throw new Error('Invalid registration data');
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
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