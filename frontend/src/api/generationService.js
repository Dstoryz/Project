import api from './api';
import { ENDPOINTS, API_CONFIG } from './config';

export const generationService = {
  async generateImage(data) {
    try {
      const response = await api.post(ENDPOINTS.GENERATE, {
        prompt: data.prompt,
        model: data.model,
        style: data.style,
        n_steps: data.n_steps,
        guidance_scale: data.guidance_scale,
        seed: data.seed,
        width: data.width,
        height: data.height,
        negative_prompt: data.negative_prompt,
        sampler: data.sampler,
        clip_skip: data.clip_skip,
        tiling: data.tiling,
        hires_fix: data.hires_fix,
        denoising_strength: data.denoising_strength,
        safety_checker: data.safety_checker,
      });
      return response.data;
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
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