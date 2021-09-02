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
import { registerRestaurantDto } from 'src/dtos/register-restaurant.dto';
import { UpdateRestaurantDto } from 'src/dtos/update-restaurant.dto';
import { Role } from 'src/enum/roles.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { RestaurantsService } from './restaurants.service';

@Controller('api/v1/restaurants')
export class RestaurantsController {
  constructor(private restService: RestaurantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.admin)
  async registerRestaurant(@Body() data: registerRestaurantDto) {
    try {
      const result = await this.restService.registerRestaurant(data);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Could not create user with given params');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getAllRestaurants(@Query() data: GetAllDataDto) {
    try {
      const result = await this.restService.getAllRestaurants(data);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Something went wrong!');
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.admin)
  async deleteRestaurant(@Param('id') id: number) {
    try {
      const result = await this.restService.deleteRestaurant(id);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Something went wrong!');
    }
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.manager)
  async updateRestaurant(
    @Param('id') id: number,
    @Body() data: UpdateRestaurantDto,
    @Req() req,
  ) {
    try {
      const { user } = req;
      const result = await this.restService.updateRestaurant(
        Number(id),
        data,
        user.userId,
      );
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Something went wrong!');
    }
  }
}
