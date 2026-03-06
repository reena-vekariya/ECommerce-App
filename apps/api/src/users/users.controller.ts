import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards, Request, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Post('me/addresses')
  addAddress(@Request() req: any, @Body() address: object) {
    return this.usersService.addAddress(req.user.userId, address);
  }

  @Get()
  @Roles('admin')
  @UseGuards(RolesGuard)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Patch(':id/role')
  @Roles('admin')
  @UseGuards(RolesGuard)
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
