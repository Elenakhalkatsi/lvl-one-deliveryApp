import { Injectable, Logger } from '@nestjs/common';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { registerRestaurantDto } from 'src/dtos/register-restaurant.dto';
import { UpdateRestaurantDto } from 'src/dtos/update-restaurant.dto';
import { RestaurantsRepository } from 'src/repositories/restaurants/restaurants.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);
  constructor(
    private readonly restRepo: RestaurantsRepository,
    private readonly usersService: UsersService,
  ) {}
  async registerRestaurant(data: registerRestaurantDto) {
    return await this.restRepo.registerRestaurant(data);
  }

  async getAllRestaurants(data: GetAllDataDto) {
    return await this.restRepo.getAllRestaurants(data);
  }

  async deleteRestaurant(id: number) {
    return await this.restRepo.deleteRestaurant(Number(id));
  }

  async updateRestaurant(
    id: number,
    data: UpdateRestaurantDto,
    userId: number,
  ) {
    const userToCheck = await this.usersService.findUserById(userId);

    if (userToCheck.length > 0) {
      if (userToCheck[0].restaurant === id) {
        return await this.restRepo.updateRestaurant(id, data);
      }
      return `Manager does not match to the restaurant`;
    }
    return `Could not check the user`;
  }
  async updateRestaurantRating(id: number, rating: number) {
    return await this.restRepo.updateRestaurantRating(id, rating);
  }
}
