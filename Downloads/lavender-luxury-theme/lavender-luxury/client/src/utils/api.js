import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || '/api'
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ve_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ve_token');
      const currentPath = window.location.pathname;
      const redirectUrl = currentPath !== '/login' && currentPath !== '/register'
        ? `/login?redirect=${encodeURIComponent(currentPath)}`
        : '/login';
      window.location.href = redirectUrl;
    }
    return Promise.reject(err);
  }
);

export default api;
