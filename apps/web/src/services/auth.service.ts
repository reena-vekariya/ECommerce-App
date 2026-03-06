import api from './api';

export const authService = {
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),

  getMe: () => api.get('/users/me').then((r) => r.data),
};
