import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CartService } from '../cart/cart.service';
import { CouponsService } from '../coupons/coupons.service';
import { ProductsService } from '../products/products.service';

interface ShippingAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private couponsService: CouponsService,
    private productsService: ProductsService,
  ) {}

  async createOrder(userId: string, shippingAddress: ShippingAddress, couponCode?: string) {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) throw new BadRequestException('Cart is empty');

    const items = cart.items.map((item) => {
      const product = item.productId as any;
      return {
        productId: product._id,
        qty: item.qty,
        price: item.price,
        name: product.name,
        image: product.images?.[0] || '',
      };
    });

    let totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    let discount = 0;

    if (couponCode) {
      const coupon = await this.couponsService.validateCoupon(couponCode, totalAmount);
      if (coupon.discountType === 'percent') {
        discount = (totalAmount * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }
      await this.couponsService.incrementUsage(coupon._id.toString());
    }

    totalAmount = Math.max(0, totalAmount - discount);

    const order = await this.orderModel.create({
      userId,
      items,
      shippingAddress,
      totalAmount,
      couponCode: couponCode || null,
      discount,
    });

    // Decrement stock
    for (const item of items) {
      await this.productsService.decrementStock(item.productId.toString(), item.qty);
    }

    await this.cartService.clearCart(userId);

    return this.orderModel.findById(order._id).exec();
  }

  async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments({ userId }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOrderById(id: string, userId?: string) {
    const query: any = { _id: id };
    if (userId) query.userId = userId;
    const order = await this.orderModel.findOne(query).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getAllOrders(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (status) query.status = status;
    const [data, total] = await Promise.all([
      this.orderModel.find(query).populate('userId', 'email fullName').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(query),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getStats() {
    const [totalOrders, revenueAgg, recentOrders, statusAgg, revenueByDay] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      this.orderModel.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'email fullName').exec(),
      this.orderModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      this.orderModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 7 },
      ]),
    ]);

    const ordersByStatus: Record<string, number> = {};
    statusAgg.forEach((s: any) => { ordersByStatus[s._id] = s.count; });

    return {
      totalOrders,
      totalRevenue: revenueAgg[0]?.total ?? 0,
      recentOrders,
      ordersByStatus,
      revenueByDay: revenueByDay.map((r: any) => ({ date: r._id, revenue: r.revenue })),
    };
  }
}
