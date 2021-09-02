import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddRatingDto } from 'src/dtos/add-rating.dto';
import { Role } from 'src/enum/roles.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { RatingsService } from './ratings.service';

@Controller('api/v1/ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @UsePipes(ValidationPipe)
  async addRatingAndCalculateAverage(@Body() data: AddRatingDto, @Req() req) {
    try {
      const { user } = req;
      const result = await this.ratingsService.addRatingAndCalculateAverage(
        data,
        user.userId,
      );
      return getSuccessMessage(result);
    } catch (err) {
      getErrorMessage('could not rate order with given params');
    }
  }

  @Get(':restaurantId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getRestaurantReview(@Param('restaurantId') restaurantId: string) {
    try {
      const result = await this.ratingsService.getRestaurantReview(
        Number(restaurantId),
      );
      return result;
    } catch (err) {
      getErrorMessage('Something went wrong');
    }
  }
}
