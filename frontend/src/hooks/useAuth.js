import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Можно добавить проверку токена здесь
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, login, logout };
}; 