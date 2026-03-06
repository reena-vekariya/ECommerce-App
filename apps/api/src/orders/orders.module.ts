import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './order.schema';
import { CartModule } from '../cart/cart.module';
import { CouponsModule } from '../coupons/coupons.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    CouponsModule,
    ProductsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
