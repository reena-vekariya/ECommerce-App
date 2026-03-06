import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Number, default: null })
  discountPrice: number | null;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Prop({ default: 0 })
  stock: number;

  @Prop({
    type: { avg: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    default: { avg: 0, count: 0 },
  })
  ratings: { avg: number; count: number };

  @Prop({ default: '' })
  brand: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });
