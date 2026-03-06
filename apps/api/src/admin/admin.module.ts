import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [OrdersModule, UsersModule, ProductsModule],
  controllers: [AdminController],
})
export class AdminModule {}
