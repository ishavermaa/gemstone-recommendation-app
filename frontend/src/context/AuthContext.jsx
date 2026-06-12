import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginUser, registerUser, updateProfile as updateProfileRequest } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gemstone_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('gemstone_token');
    if (!token) return;

    getProfile()
      .then(({ user: profile }) => {
        setUser(profile);
        localStorage.setItem('gemstone_user', JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem('gemstone_token');
        localStorage.removeItem('gemstone_user');
        setUser(null);
      });
  }, []);

  const persistSession = ({ user: nextUser, token }) => {
    localStorage.setItem('gemstone_token', token);
    localStorage.setItem('gemstone_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await loginUser(payload);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await registerUser(payload);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    setLoading(true);
    try {
      const data = await updateProfileRequest(payload);
      localStorage.setItem('gemstone_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gemstone_token');
    localStorage.removeItem('gemstone_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
