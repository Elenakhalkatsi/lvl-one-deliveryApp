import { Injectable, Logger } from '@nestjs/common';
import { AddRatingDto } from 'src/dtos/add-rating.dto';
import { OrderStatus } from 'src/enum/order-status.enum';
import { RatingsRepository } from 'src/repositories/rating/rating.repository';
import { OrdersService } from '../orders/orders.service';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class RatingsService {
  private readonly logger = new Logger(RatingsService.name);
  constructor(
    private readonly ratingRepo: RatingsRepository,
    private readonly restaurantService: RestaurantsService, // private readonly orderRepo: OrdersRepository,
    private readonly ordersService: OrdersService,
  ) {}

  async addRatingAndCalculateAverage(data: AddRatingDto, userId: number) {
    const foundOrder = await this.ordersService.findOrderbyId(data.order);
    if (
      foundOrder[0].orderStatus === OrderStatus.delivered &&
      foundOrder[0].restaurant === data.restaurant &&
      foundOrder[0].userId === userId
    ) {
      const result = await this.ratingRepo.addRating(data);
      const avgRating = await this.ratingRepo.getRestaurantAvarageRating(
        data.restaurant,
      );
      await this.restaurantService.updateRestaurantRating(
        data.restaurant,
        Number(avgRating),
      );
      return result;
    }
    return 'could not rated';
  }

  async getRestaurantAvarageRating(id: number) {
    const result = await this.ratingRepo.getRestaurantAvarageRating(id);
    return result;
  }

  async getRestaurantReview(restaurantId: number) {
    const result = await this.ratingRepo.getRestaurantReview(restaurantId);
    return result;
  }
}
