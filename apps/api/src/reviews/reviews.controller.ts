import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createReview(
    @Request() req: any,
    @Body() body: { productId: string; rating: number; comment: string },
  ) {
    return this.reviewsService.createReview(req.user.userId, body.productId, body.rating, body.comment);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
