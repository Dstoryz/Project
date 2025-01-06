/*/home/alex/Documents/Project/frontend/src/api/api.js*/

import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // или из cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Обработка ответов
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry && 
        !originalRequest.url.includes('token/refresh')) {
      originalRequest._retry = true;

      try {
        const refresh = document.cookie
          .split('; ')
          .find(row => row.startsWith('refresh='))
          ?.split('=')[1];

        if (refresh) {
          const response = await api.post('/api/token/refresh/', { refresh }, {
            headers: {
              'Content-Type': 'application/json',
            },
            skipAuthRefresh: true
          });
          const { access } = response.data;

          // Сохраняем новый токен в cookies
          document.cookie = `token=${access}; path=/;`;
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        document.cookie = 'token=; Max-Age=0; path=/;'; // Удаляем токен
        document.cookie = 'refresh=; Max-Age=0; path=/;'; // Удаляем refresh токен
        if (!originalRequest.url.includes('history')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api; 