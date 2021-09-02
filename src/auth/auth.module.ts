import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtStrategy } from './auth-jwt-strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtSecret } from './password.const';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: jwtSecret.secret,
      signOptions: { expiresIn: '300m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
