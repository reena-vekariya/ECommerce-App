import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ type: Array, default: [] })
  addresses: object[];
}

export const UserSchema = SchemaFactory.createForClass(User);
