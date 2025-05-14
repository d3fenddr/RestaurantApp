import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const expireTimeStr = getCookie('refreshTokenExpire');
    if (!expireTimeStr) return;

    const expireTime = new Date(expireTimeStr).getTime();
    const now = Date.now();
    const timeLeft = expireTime - now;

    if (timeLeft <= 0) {
      logout();
    } else {
      const timeout = setTimeout(() => {
        logout();
      }, timeLeft);

      return () => clearTimeout(timeout);
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
