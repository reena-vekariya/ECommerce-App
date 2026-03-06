import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Request() req: any, @Body() body: { shippingAddress: any; couponCode?: string }) {
    return this.ordersService.createOrder(req.user.userId, body.shippingAddress, body.couponCode);
  }

  @Get()
  getUserOrders(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('all') all?: string,
    @Query('status') status?: string,
  ) {
    if (all === 'true' && req.user.role === 'admin') {
      return this.ordersService.getAllOrders(Number(page) || 1, Number(limit) || 20, status);
    }
    return this.ordersService.getUserOrders(req.user.userId, Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  getOrder(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.role === 'admin' ? undefined : req.user.userId;
    return this.ordersService.getOrderById(id, userId);
  }

  @Patch(':id/status')
  @Roles('admin')
  @UseGuards(RolesGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
