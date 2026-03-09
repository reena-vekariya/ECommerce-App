import api from './api';
import { IAddress } from '@/types';

export const userService = {
  getMe: () => api.get('/users/me').then((r) => r.data),
  addAddress: (address: Omit<IAddress, 'isDefault'>) =>
    api.post('/users/me/addresses', address).then((r) => r.data),
  removeAddress: (addressId: string) =>
    api.delete(`/users/me/addresses/${addressId}`).then((r) => r.data),
  setDefaultAddress: (addressId: string) =>
    api.patch(`/users/me/addresses/${addressId}/default`).then((r) => r.data),
};
