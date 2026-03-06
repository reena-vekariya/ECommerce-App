import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId }).populate('items.productId').exec();
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [] });
    }
    return cart;
  }

  async addItem(userId: string, productId: string, qty: number) {
    const product = await this.productsService.findById(productId);
    const price = product.discountPrice ?? product.price;

    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), qty, price });
    }

    await cart.save();
    return this.cartModel.findById(cart._id).populate('items.productId').exec();
  }

  async updateItem(userId: string, itemId: string, qty: number) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => (i as any)._id.toString() === itemId);
    if (!item) throw new NotFoundException('Item not found');

    if (qty <= 0) {
      cart.items = cart.items.filter((i) => (i as any)._id.toString() !== itemId) as any;
    } else {
      item.qty = qty;
    }

    await cart.save();
    return this.cartModel.findById(cart._id).populate('items.productId').exec();
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');
    cart.items = cart.items.filter((i) => (i as any)._id.toString() !== itemId) as any;
    await cart.save();
    return this.cartModel.findById(cart._id).populate('items.productId').exec();
  }

  async clearCart(userId: string) {
    await this.cartModel.findOneAndUpdate({ userId }, { items: [] }).exec();
  }
}
