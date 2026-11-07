'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { UserRole, UserSummary } from '@kalyanaconnect/shared';

interface AuthUser extends UserSummary {
  vendorProfile?: {
    id: string;
    businessName: string;
    slug: string;
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    verificationStatus: 'UNVERIFIED' | 'VERIFIED';
    rejectionReason?: string | null;
  } | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isCustomer: boolean;
  isVendor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount by attempting refresh
  const initSession = useCallback(async () => {
    try {
      const res = await api.post<{ user: AuthUser; accessToken: string }>('/auth/refresh');
      if (res.success && res.data) {
        api.setToken(res.data.accessToken);
        setToken(res.data.accessToken);

        // Fetch full profile with vendor details
        const meRes = await api.get<AuthUser>('/auth/me');
        if (meRes.success && meRes.data) {
          setUser(meRes.data);
        } else {
          setUser(res.data.user);
        }
      } else {
        api.setToken(null);
        setToken(null);
        setUser(null);
      }
    } catch {
      api.setToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ user: AuthUser; accessToken: string }>('/auth/login', {
        email,
        password,
      });

      if (res.success && res.data) {
        api.setToken(res.data.accessToken);
        setToken(res.data.accessToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }

      return {
        success: false,
        error: res.error?.message || 'Login failed. Please check your credentials.',
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during login.' };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.post<{ user: AuthUser; accessToken: string }>('/auth/register', data);

      if (res.success && res.data) {
        api.setToken(res.data.accessToken);
        setToken(res.data.accessToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }

      return {
        success: false,
        error: res.error?.message || 'Registration failed.',
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during registration.' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      api.setToken(null);
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get<AuthUser>('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch {
      // Ignore
    }
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isVendor = user?.role === 'VENDOR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        isCustomer,
        isVendor,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
