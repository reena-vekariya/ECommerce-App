import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './coupon.schema';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async validateCoupon(code: string, orderAmount: number): Promise<CouponDocument> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.isActive) throw new BadRequestException('Coupon is inactive');
    if (new Date(coupon.expiresAt) < new Date()) throw new BadRequestException('Coupon has expired');
    if (coupon.usedCount >= coupon.maxUses) throw new BadRequestException('Coupon usage limit reached');
    if (orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(`Minimum order amount is $${coupon.minOrderAmount}`);
    }
    return coupon;
  }

  async incrementUsage(id: string) {
    await this.couponModel.findByIdAndUpdate(id, { $inc: { usedCount: 1 } }).exec();
  }

  findAll() {
    return this.couponModel.find().exec();
  }

  async create(data: any) {
    const coupon = new this.couponModel(data);
    return coupon.save();
  }

  async update(id: string, data: any) {
    const coupon = await this.couponModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async delete(id: string) {
    await this.couponModel.findByIdAndDelete(id).exec();
  }
}
