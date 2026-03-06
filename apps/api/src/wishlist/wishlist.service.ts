import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {}

  async getWishlist(userId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId }).populate('productIds').exec();
    if (!wishlist) {
      wishlist = await this.wishlistModel.create({ userId, productIds: [] });
    }
    return wishlist;
  }

  async addProduct(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOneAndUpdate(
      { userId },
      { $addToSet: { productIds: new Types.ObjectId(productId) } },
      { new: true, upsert: true },
    ).populate('productIds').exec();
    return wishlist;
  }

  async removeProduct(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { productIds: new Types.ObjectId(productId) } },
      { new: true },
    ).populate('productIds').exec();
    return wishlist;
  }
}
