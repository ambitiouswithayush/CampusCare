import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'doctor' | 'admin';
  collegeId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: 'student' | 'doctor', collegeId?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and validate with backend
    const checkAuth = async () => {
      const token = localStorage.getItem('campuscare_token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.success && response.user) {
            const userData: User = {
              id: response.user._id,
              email: response.user.email,
              name: response.user.name,
              role: response.user.role,
              collegeId: response.user.collegeId,
            };
            setUser(userData);
            localStorage.setItem('campuscare_user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('campuscare_token');
          localStorage.removeItem('campuscare_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.login(email, password);

      if (response.success && response.token && response.user) {
        const userData: User = {
          id: response.user._id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          collegeId: response.user.collegeId,
        };

        setUser(userData);
        localStorage.setItem('campuscare_user', JSON.stringify(userData));
        localStorage.setItem('campuscare_token', response.token);
        return { success: true };
      }

      return { success: false, error: response.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'doctor', collegeId?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.register(name, email, password, role, collegeId);

      if (response.success && response.token && response.user) {
        const userData: User = {
          id: response.user._id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          collegeId: response.user.collegeId,
        };

        setUser(userData);
        localStorage.setItem('campuscare_user', JSON.stringify(userData));
        localStorage.setItem('campuscare_token', response.token);
        return { success: true };
      }

      return { success: false, error: response.message || 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campuscare_user');
    localStorage.removeItem('campuscare_token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
