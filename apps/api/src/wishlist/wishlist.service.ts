import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './wishlist.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    private productsService: ProductsService,
  ) {}

  private async populateProducts(productIds: Types.ObjectId[]) {
    const products = await Promise.all(
      productIds.map((id) =>
        this.productsService.findById(id.toString()).catch(() => null),
      ),
    );
    return products.filter(Boolean);
  }

  async getWishlist(userId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId }).exec();
    if (!wishlist) {
      wishlist = await this.wishlistModel.create({ userId, productIds: [] });
    }
    const products = await this.populateProducts(wishlist.productIds as Types.ObjectId[]);
    return { ...wishlist.toObject(), productIds: products };
  }

  async addProduct(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOneAndUpdate(
      { userId },
      { $addToSet: { productIds: new Types.ObjectId(productId) } },
      { new: true, upsert: true },
    ).exec();
    const products = await this.populateProducts(wishlist!.productIds as Types.ObjectId[]);
    return { ...wishlist!.toObject(), productIds: products };
  }

  async removeProduct(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { productIds: new Types.ObjectId(productId) } },
      { new: true },
    ).exec();
    const products = await this.populateProducts(
      (wishlist?.productIds ?? []) as Types.ObjectId[],
    );
    return { ...(wishlist?.toObject() ?? {}), productIds: products };
  }
}
