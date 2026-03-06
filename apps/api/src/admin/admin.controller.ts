import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  @Get('stats')
  async getStats() {
    const [orderStats, usersData, productsData] = await Promise.all([
      this.ordersService.getStats(),
      this.usersService.findAll(1, 1),
      this.productsService.findAll({ limit: 1 }),
    ]);

    return {
      ...orderStats,
      totalUsers: usersData.total,
      totalProducts: productsData.total,
    };
  }
}
