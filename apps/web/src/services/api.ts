import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // On 401, clear auth and redirect — but only for non-auth endpoints
    // to avoid redirect loops on the login page itself.
    if (
      err.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !err.config?.url?.includes('/auth/')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      useAuthStore().logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// Lazy import to avoid circular dependency
function useAuthStore() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/store/auth.store').useAuthStore.getState();
}

export default api;
