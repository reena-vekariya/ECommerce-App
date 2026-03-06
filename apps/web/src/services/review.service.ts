import api from './api';

export const reviewService = {
  getReviews: (productId: string) =>
    api.get(`/reviews/${productId}`).then((r) => r.data),

  createReview: (data: { productId: string; rating: number; comment: string }) =>
    api.post('/reviews', data).then((r) => r.data),

  deleteReview: (id: string) =>
    api.delete(`/reviews/${id}`).then((r) => r.data),
};
