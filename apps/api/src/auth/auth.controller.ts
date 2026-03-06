import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() fullName: string;
}

class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.fullName);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
