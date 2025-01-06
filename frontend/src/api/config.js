export const API_BASE_URL = 'http://localhost:8000';

export const ENDPOINTS = {
  LOGIN: '/api/login/',
  REGISTER: '/api/register/',
  TOKEN_REFRESH: '/api/token/refresh/',
  GENERATE_IMAGE: '/api/generate/',
  HISTORY: '/api/generation/history/'
};

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}; 