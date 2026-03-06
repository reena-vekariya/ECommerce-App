import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from './review.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ProductsModule,
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
