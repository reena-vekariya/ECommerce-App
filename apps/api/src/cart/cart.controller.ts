import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addItem(@Request() req: any, @Body() body: { productId: string; qty: number }) {
    return this.cartService.addItem(req.user.userId, body.productId, body.qty || 1);
  }

  @Patch(':itemId')
  updateItem(@Request() req: any, @Param('itemId') itemId: string, @Body() body: { qty: number }) {
    return this.cartService.updateItem(req.user.userId, itemId, body.qty);
  }

  @Delete(':itemId')
  removeItem(@Request() req: any, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }
}
