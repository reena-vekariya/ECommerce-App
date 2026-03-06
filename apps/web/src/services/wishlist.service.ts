import api from './api';

export const wishlistService = {
  getWishlist: () => api.get('/wishlist').then((r) => r.data),
  addProduct: (productId: string) => api.post(`/wishlist/${productId}`).then((r) => r.data),
  removeProduct: (productId: string) => api.delete(`/wishlist/${productId}`).then((r) => r.data),
};

export const couponService = {
  validate: (code: string, orderAmount: number) =>
    api.post('/coupons/validate', { code, orderAmount }).then((r) => r.data),
  getCoupons: () => api.get('/coupons').then((r) => r.data),
  createCoupon: (data: any) => api.post('/coupons', data).then((r) => r.data),
  updateCoupon: (id: string, data: any) => api.put(`/coupons/${id}`, data).then((r) => r.data),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`).then((r) => r.data),
};

export const adminService = {
  getStats: () => api.get('/admin/stats').then((r) => r.data),
  getUsers: (params?: any) => api.get('/users', { params }).then((r) => r.data),
  updateUserRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }).then((r) => r.data),
  deleteUser: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },
};
