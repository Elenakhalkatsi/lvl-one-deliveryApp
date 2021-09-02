import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    const foundUser = await this.usersService.findUserByEmailAndPassword(
      data.email,
      data.password,
    );
    if (!foundUser) {
      return {
        status: 'Error',
        message: 'Incorrect email or password',
      };
    }
    const jwtToken = await this.authService.login(foundUser);

    return {
      status: 'success',
      data: {
        email: foundUser.email,
        fullName: foundUser.fullName,
        jwtToken,
      },
    };
  }
}
