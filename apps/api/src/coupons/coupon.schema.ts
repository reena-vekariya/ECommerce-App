import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ required: true, enum: ['percent', 'fixed'] })
  discountType: string;

  @Prop({ required: true })
  discountValue: number;

  @Prop({ default: 0 })
  minOrderAmount: number;

  @Prop({ default: 100 })
  maxUses: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
