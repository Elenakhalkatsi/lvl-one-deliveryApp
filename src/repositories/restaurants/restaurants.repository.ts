import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { registerRestaurantDto } from 'src/dtos/register-restaurant.dto';
import { UpdateRestaurantDto } from 'src/dtos/update-restaurant.dto';
import { RestaurantEntity } from 'src/entities/restaurant.entity';
import { Restaurant } from 'src/interface/restaurant.interface';
import { getAllQuery } from 'src/utils/get-all.query';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantsRepository {
  private readonly logger = new Logger(RestaurantsRepository.name);
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restRepo: Repository<RestaurantEntity>,
  ) {}

  async registerRestaurant(data: registerRestaurantDto): Promise<Restaurant> {
    try {
      const newRestaurant = new RestaurantEntity();
      newRestaurant.restaurantName = data.name;
      newRestaurant.phoneNumber = data.phoneNumber;
      newRestaurant.address = data.address;
      newRestaurant.email = data.email;
      newRestaurant.manager = data.manager;

      const result = await this.restRepo.save(newRestaurant);
      this.logger.log(`restaurant added ${result}`);
      return result;
    } catch (err) {
      this.logger.error(`Could not add a new restaurant ${err}`);
      return null;
    }
  }

  async getAllRestaurants(data: GetAllDataDto) {
    try {
      this.logger.log(`data recieved from front : ${JSON.stringify(data)}`);
      const queryBuilder = this.restRepo.createQueryBuilder('restaurants');
      //queryBuilder.leftJoinAndSelect('restaurants.rating', 'ratings');
      queryBuilder.where('deleted = false');
      getAllQuery(queryBuilder, data);

      const result = await queryBuilder.getRawMany();
      return result.map((res) => ({
        name: res.restaurants_restaurantName,
        email: res.restaurants_email,
        address: res.restaurants_address,
        phoneNumber: res.restaurants_phoneNumber,
        averageRating: res.restaurants_averageRating,
      }));
    } catch (err) {
      this.logger.error(`Could not get restaurants, ${err}`);
      return null;
    }
  }

  async deleteRestaurant(id: number) {
    try {
      this.logger.error(`Restaurant with id: ${id} - was deleted! `);
      const result = await this.restRepo.save({
        id,
        deleted: true,
      });
      return result;
    } catch (err) {
      this.logger.error(`Could not delete Restaurant ${err}`);
      return null;
    }
  }

  async updateRestaurant(id: number, data: UpdateRestaurantDto) {
    try {
      this.logger.error(`staring to update restaurnt `);
      await this.restRepo.update({ id }, data);
      return await this.restRepo.findOne(id);
    } catch (err) {
      this.logger.error(`Could not update Restaurant ${err}`);
      return null;
    }
  }

  async updateRestaurantRating(id: number, rating: number) {
    try {
      const result = await this.restRepo.save({
        id,
        averageRating: rating,
      });
      this.logger.error(`Restaurant rating with id: ${id} - was updated! `);
      return result;
    } catch (err) {
      this.logger.error(`Could not update restaurant rating ${err}`);
      return null;
    }
  }
}
