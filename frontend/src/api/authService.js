import api from './api';
import { ENDPOINTS } from './config';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, userData);
      this.setTokens(response.data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async login(credentials) {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, credentials);
      this.setTokens(response.data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async refreshToken() {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) throw new Error('No refresh token available');

      const response = await api.post(ENDPOINTS.TOKEN_REFRESH, {
        refresh
      });
      
      localStorage.setItem('token', response.data.access);
      return response.data.access;
    } catch (error) {
      this.logout();
      throw this.handleError(error);
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  },

  setTokens(data) {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.refresh) localStorage.setItem('refresh', data.refresh);
  },

  handleError(error) {
    if (error.response?.status === 401) {
      this.logout();
    }
    return error;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}; 