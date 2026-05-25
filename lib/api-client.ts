import axios from 'axios';
import { getApiBaseUrl } from '@/lib/api-base';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('admin_token');
        const locale = window.location.pathname.startsWith('/en') ? 'en' : 'ar';
        window.location.href = `/${locale}/admin/login`;
      }
    }
    return Promise.reject(error);
  }
);
