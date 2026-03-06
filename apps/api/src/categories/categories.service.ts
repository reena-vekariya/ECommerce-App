import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private catModel: Model<CategoryDocument>) {}

  findAll() {
    return this.catModel.find().exec();
  }

  findById(id: string) {
    return this.catModel.findById(id).exec();
  }

  async create(data: { name: string; slug: string; parentId?: string; image?: string }) {
    const cat = new this.catModel(data);
    return cat.save();
  }

  async update(id: string, data: Partial<{ name: string; slug: string; parentId: string; image: string }>) {
    const cat = await this.catModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async delete(id: string) {
    await this.catModel.findByIdAndDelete(id).exec();
  }
}
