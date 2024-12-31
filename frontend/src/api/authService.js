import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './config';
import { useState, useEffect } from 'react';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавим перехватчик для логирования запросов
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Error Response:', error.response?.data);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, {
        username: credentials.username,
        password: credentials.password
      });

      console.log('Login response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      return {
        token: response.data.token,
        user: {
          username: credentials.username
        }
      };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, {
        username: userData.username,
        email: userData.email,
        password: userData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refresh', response.data.refresh);
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      console.error('Registration error:', error.response?.data);
      throw new Error(errorMessage);
    }
  },

  refreshToken: async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      const response = await api.post(ENDPOINTS.TOKEN_REFRESH, {
        refresh
      });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
};

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