import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vk_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('vk_admin_token') || '');
  const [backendOnline, setBackendOnline] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken('');
    localStorage.removeItem('vk_admin_token');
    localStorage.removeItem('vk_admin_user');
  }, []);

  useEffect(() => {
    // Check backend connection health
    api.checkHealth().then((isOnline) => setBackendOnline(isOnline));
    const interval = setInterval(() => {
      api.checkHealth().then((isOnline) => setBackendOnline(isOnline));
    }, 15000);

    // If token exists, verify validity against backend
    if (token) {
      api.getProfile()
        .then((res) => {
          if (!res || !res.success) {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }

    // Auto-logout when any API call returns 401 Unauthorized
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token, logout]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('vk_admin_token', res.data.token);
      localStorage.setItem('vk_admin_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error('Invalid response from server');
  };

  const quickAdminLogin = async () => {
    return await login('admin@madhafancy.com', 'admin123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        backendOnline,
        login,
        quickAdminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
