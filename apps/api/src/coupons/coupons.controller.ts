import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  validate(@Body() body: { code: string; orderAmount: number }) {
    return this.couponsService.validateCoupon(body.code, body.orderAmount);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() body: any) {
    return this.couponsService.update(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.couponsService.delete(id);
  }
}
