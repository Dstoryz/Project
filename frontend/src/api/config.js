export const API_BASE_URL = 'http://localhost:8000';

export const ENDPOINTS = {
  GENERATE_IMAGE: '/api/generation/generate/',
  HISTORY: '/api/generation/history/',
};

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}; 