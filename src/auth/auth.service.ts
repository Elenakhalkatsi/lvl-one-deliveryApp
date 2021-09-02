import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async login(user: UsersEntity) {
    const payload = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      sub: user.id,
      role: user.userRole,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
