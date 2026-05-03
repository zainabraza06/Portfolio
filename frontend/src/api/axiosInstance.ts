import axios from 'axios';

/** Production: set `VITE_API_BASE_URL` (e.g. https://portfolio-d5vs.onrender.com/api). Dev: omit to use `/api` + Vite proxy. */
const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
      if (window.location.pathname.startsWith('/admin/dashboard')) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
