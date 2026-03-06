import api from './api';

export const orderService = {
  createOrder: (data: { shippingAddress: any; couponCode?: string }) =>
    api.post('/orders', data).then((r) => r.data),

  getOrders: (params?: Record<string, any>) =>
    api.get('/orders', { params }).then((r) => r.data),

  getOrder: (id: string) =>
    api.get(`/orders/${id}`).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
};
