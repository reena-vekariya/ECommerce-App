import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll(filters: ProductFilters = {}) {
    const { search, categoryId, minPrice, maxPrice, minRating, inStock, page = 1, limit = 12, sort } = filters;
    const query: any = { isActive: true };

    if (search) query.$text = { $search: search };
    if (categoryId) query.categoryId = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (minRating !== undefined) query['ratings.avg'] = { $gte: minRating };
    if (inStock) query.stock = { $gt: 0 };

    let sortObj: any = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { 'ratings.avg': -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel.find(query).populate('categoryId').sort(sortObj).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).populate('categoryId').exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug }).populate('categoryId').exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: any) {
    const product = new this.productModel(data);
    return product.save();
  }

  async update(id: string, data: any) {
    const product = await this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async delete(id: string) {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  async updateRating(productId: string, avgRating: number, count: number) {
    return this.productModel.findByIdAndUpdate(
      productId,
      { 'ratings.avg': avgRating, 'ratings.count': count },
      { new: true },
    ).exec();
  }

  async decrementStock(productId: string, qty: number) {
    return this.productModel.findByIdAndUpdate(
      productId,
      { $inc: { stock: -qty } },
      { new: true },
    ).exec();
  }
}
