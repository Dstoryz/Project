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
        color_scheme: data.color_scheme
      });
      return response.data;
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  },

  async getHistory(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.HISTORY}?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch history');
    }
  },

  async deleteImage(imageId) {
    try {
      await api.delete(`${ENDPOINTS.HISTORY}${imageId}/`);
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete image');
    }
  },

  async toggleFavorite(imageId) {
    try {
      const response = await api.post(`${ENDPOINTS.HISTORY}${imageId}/favorite/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to toggle favorite');
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