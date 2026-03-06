import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        qty: Number,
        price: Number,
        name: String,
        image: String,
      },
    ],
    required: true,
  })
  items: { productId: Types.ObjectId; qty: number; price: number; name: string; image: string }[];

  @Prop({ type: Object, required: true })
  shippingAddress: {
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @Prop({ default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
  status: string;

  @Prop({ default: 'cod' })
  paymentMethod: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: String, default: null })
  couponCode: string | null;

  @Prop({ default: 0 })
  discount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
