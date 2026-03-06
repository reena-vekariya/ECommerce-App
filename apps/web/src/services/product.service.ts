import api from './api';

export const productService = {
  getProducts: (params?: Record<string, any>) =>
    api.get('/products', { params }).then((r) => r.data),

  getProduct: (id: string) =>
    api.get(`/products/${id}`).then((r) => r.data),

  createProduct: (data: any) =>
    api.post('/products', data).then((r) => r.data),

  updateProduct: (id: string, data: any) =>
    api.put(`/products/${id}`, data).then((r) => r.data),

  deleteProduct: (id: string) =>
    api.delete(`/products/${id}`).then((r) => r.data),
};

export const categoryService = {
  getCategories: () => api.get('/categories').then((r) => r.data),
  createCategory: (data: any) => api.post('/categories', data).then((r) => r.data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
};
