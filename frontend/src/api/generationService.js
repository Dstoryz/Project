import api from './api';
import { ENDPOINTS, API_CONFIG } from './config';

export const generationService = {
  async generateImage(data) {
    try {
      const response = await api.post(ENDPOINTS.GENERATE, data, {
        timeout: API_CONFIG.GENERATION_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Image generation error:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to generate image. Please try again.');
    }
  },

  async getHistory() {
    try {
      console.log('Making history request...');
      const response = await api.get(ENDPOINTS.HISTORY);
      console.log('History response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      if (error.response?.status === 401) {
        throw new Error('Необходима авторизация');
      }
      throw new Error(error.response?.data?.detail || 'Не удалось загрузить историю');
    }
  },

  async deleteFromHistory(id) {
    try {
      await api.delete(`${ENDPOINTS.HISTORY}${id}/`);
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete image');
    }
  },

  async initializeCSRF() {
    try {
      await api.get(ENDPOINTS.CSRF);
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }
}; 