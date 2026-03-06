import api from './api';

export const cartService = {
  getCart: () => api.get('/cart').then((r) => r.data),
  addItem: (productId: string, qty: number = 1) =>
    api.post('/cart', { productId, qty }).then((r) => r.data),
  updateItem: (itemId: string, qty: number) =>
    api.patch(`/cart/${itemId}`, { qty }).then((r) => r.data),
  removeItem: (itemId: string) =>
    api.delete(`/cart/${itemId}`).then((r) => r.data),
};
