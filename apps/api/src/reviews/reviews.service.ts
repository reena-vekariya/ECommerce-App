import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productsService: ProductsService,
  ) {}

  async getProductReviews(productId: string) {
    return this.reviewModel.find({ productId }).populate('userId', 'fullName').sort({ createdAt: -1 }).exec();
  }

  async createReview(userId: string, productId: string, rating: number, comment: string) {
    const existing = await this.reviewModel.findOne({ productId, userId });
    if (existing) throw new ConflictException('You have already reviewed this product');

    const review = await this.reviewModel.create({ userId, productId, rating, comment });

    // Recalculate product rating
    const allReviews = await this.reviewModel.find({ productId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await this.productsService.updateRating(productId, Math.round(avg * 10) / 10, allReviews.length);

    return this.reviewModel.findById(review._id).populate('userId', 'fullName').exec();
  }

  async deleteReview(id: string) {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!review) return;
    const allReviews = await this.reviewModel.find({ productId: review.productId });
    const avg = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    await this.productsService.updateRating(review.productId.toString(), Math.round(avg * 10) / 10, allReviews.length);
  }
}
