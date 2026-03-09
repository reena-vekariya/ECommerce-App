import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(data: { email: string; passwordHash: string; fullName: string; role?: string }): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userModel.find().select('-passwordHash').skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateRole(id: string, role: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async addAddress(userId: string, address: object): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: address } },
      { new: true }
    ).select('-passwordHash').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async removeAddress(userId: string, addressId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select('-passwordHash').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).select('-passwordHash').exec();
    if (!user) throw new NotFoundException('User not found');
    (user.addresses as any[]).forEach((addr: any) => {
      addr.isDefault = addr._id.toString() === addressId;
    });
    return user.save();
  }
}
