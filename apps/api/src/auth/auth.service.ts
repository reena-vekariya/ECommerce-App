import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, passwordHash, fullName });
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return {
      access_token: token,
      user: { _id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return {
      access_token: token,
      user: { _id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    };
  }
}
