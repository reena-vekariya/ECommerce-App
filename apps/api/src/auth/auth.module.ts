import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-jwt-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: JWT_EXPIRES_IN } }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
