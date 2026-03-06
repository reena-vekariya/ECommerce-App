import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('wishlist')
@ApiBearerAuth()
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Request() req: any) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @Post(':productId')
  addProduct(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.addProduct(req.user.userId, productId);
  }

  @Delete(':productId')
  removeProduct(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.removeProduct(req.user.userId, productId);
  }
}
