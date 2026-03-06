import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        qty: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    default: [],
  })
  items: { productId: Types.ObjectId; qty: number; price: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
