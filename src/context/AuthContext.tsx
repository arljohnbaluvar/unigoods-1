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
  updateProfile: (data: { name?: string; university?: string }) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string) => {
    // Check for admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser(ADMIN_USER);
      localStorage.setItem('user', JSON.stringify(ADMIN_USER));
      return;
    }

    // Regular user login logic
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: email === 'arljohn.baluvar@gmail.com' ? 'Arljohn Baluvar' : 'John Doe',
        email: email,
        university: 'STI College Tagum',
        role: 'user',
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
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
        role: 'user',
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid registration data');
    }
  };

  const updateProfile = async (data: { name?: string; university?: string }) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const updatedUser = {
      ...user,
      ...data,
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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