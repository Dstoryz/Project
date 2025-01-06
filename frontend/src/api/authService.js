/*/home/alex/Documents/Project/frontend/src/api/authService.js*/

import api from './api';
import { ENDPOINTS } from './config';

export const authService = {
  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials.username);
      const response = await api.post(ENDPOINTS.LOGIN, credentials, {
        timeout: 5000,
        retries: 2,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Login response:', response.data);
      
      // Сохраняем токены после успешного логина
      const { token, refresh } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refresh', refresh);
      
      // Устанавливаем токен в заголовки для последующих запросов
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  async refreshToken() {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) throw new Error('No refresh token');

      const response = await api.post('/api/token/refresh/', { refresh });
      const { access } = response.data;
      
      // Обновляем токен в localStorage и заголовках
      localStorage.setItem('token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return access;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  logout() {
    // Очищаем токены
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  }
}; 