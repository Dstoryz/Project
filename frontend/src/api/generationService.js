import api from './api';
import { ENDPOINTS, API_CONFIG } from './config';

export const generationService = {
  async generateImage(data) {
    try {
      const response = await api.post(ENDPOINTS.GENERATE, data, {
        timeout: API_CONFIG.GENERATION_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  },

  async getHistory() {
    try {
      const response = await api.get(ENDPOINTS.HISTORY);
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch history');
    }
  },

  async deleteFromHistory(id) {
    try {
      await api.delete(`${ENDPOINTS.HISTORY}${id}/`);
    } catch (error) {
      throw error;
    }
  },

  async initializeCSRF() {
    try {
      await api.get('/api/csrf/');
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }
}; 