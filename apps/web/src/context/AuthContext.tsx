import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '@agrosmart/shared-types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const saved = localStorage.getItem('agro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agro_access_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('agro_access_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('agro_user', JSON.stringify(res.data.data));
          }
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('agro_access_token');
          localStorage.removeItem('agro_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user: userData, tokens } = res.data.data;
      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem('agro_user', JSON.stringify(userData));
      localStorage.setItem('agro_access_token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('agro_refresh_token', tokens.refreshToken);
      }
    }
  };

  const register = async (data: any) => {
    const res = await apiClient.post('/auth/register', data);
    if (res.data.success) {
      const { user: userData, tokens } = res.data.data;
      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem('agro_user', JSON.stringify(userData));
      localStorage.setItem('agro_access_token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('agro_refresh_token', tokens.refreshToken);
      }
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('agro_user');
      localStorage.removeItem('agro_access_token');
      localStorage.removeItem('agro_refresh_token');
    }
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('agro_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
