import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { UpdateUserDto } from 'src/dtos/update-users.dto';
import { Role } from 'src/enum/roles.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async registerUser(@Body() data: RegisterUserDto) {
    try {
      const result = await this.usersService.registerUser(data);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Could not create user with given params');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @UsePipes(ValidationPipe)
  async getAllUsers(@Query() data: GetAllDataDto) {
    try {
      const result = await this.usersService.getAllUsers(data);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Something went wrong!');
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async deleteUser(@Param('id') userId: string) {
    try {
      const result = await this.usersService.deleteUser(Number(userId));
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Something went wrong!');
    }
  }

  @Patch()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  updateUser(@Req() req, @Body() data: UpdateUserDto) {
    try {
      const { user } = req;
      this.usersService.updateUser(user.userId, data);
      return getSuccessMessage('User information was updated!');
    } catch (err) {
      return getErrorMessage('Something went wrong!');
    }
  }
}
