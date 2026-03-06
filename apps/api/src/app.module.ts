import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponsModule } from './coupons/coupons.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    WishlistModule,
    CouponsModule,
    UploadModule,
    AdminModule,
  ],
})
export class AppModule {}
