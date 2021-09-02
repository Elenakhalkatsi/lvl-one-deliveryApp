import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddRatingDto } from 'src/dtos/add-rating.dto';
import { RatingEntity } from 'src/entities/rating.entity';
import { Rating } from 'src/interface/rating.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RatingsRepository {
  private readonly logger = new Logger(RatingsRepository.name);
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepo: Repository<RatingEntity>,
  ) {}

  async addRating(data: AddRatingDto): Promise<Rating> {
    try {
      const newRating = new RatingEntity();
      newRating.stars = data.stars;
      newRating.restaurant = data.restaurant;
      newRating.comment = data.comment;
      newRating.order = data.order;

      const result = await this.ratingRepo.save(newRating);
      this.logger.log(`rating added ${result}`);
      return {
        id: result.id,
        stars: result.stars,
        restaurant: result.restaurant,
        comment: result.comment,
        order: result.order,
      };
    } catch (err) {
      this.logger.error(`Could not add a new rating ${err}`);
      return null;
    }
  }

  async getRestaurantAvarageRating(id: number) {
    try {
      const queryBuilder = this.ratingRepo.createQueryBuilder('rating');
      queryBuilder.leftJoinAndSelect('rating.restaurant', 'restaurants');
      queryBuilder.where('restaurants.id = :id', { id: id });
      queryBuilder.select('AVG(rating.stars)', 'avg');
      queryBuilder.andWhere('restaurants.deleted = false');

      const result = await queryBuilder.getRawMany();
      this.logger.log(
        `get average stars from one restaurant with join ${result}`,
      );
      console.log(result);

      return result[0].avg;
    } catch (err) {
      this.logger.error(`Could not get rating ${err}`);
      return null;
    }
  }

  async getRestaurantReview(restaurantId: number) {
    try {
      const queryBuilder = this.ratingRepo.createQueryBuilder('rating');
      queryBuilder.innerJoinAndSelect('rating.restaurant', 'restaurants');
      queryBuilder.where('restaurants.id = :id', { id: restaurantId });
      queryBuilder.andWhere('restaurants.deleted = false');

      const result = await queryBuilder.getRawMany();
      this.logger.log(
        `get all reviews from one restaurant with join ${result}`,
      );
      return result.map((res) => ({
        restaurantName: res.restaurants_restaurantName,
        review: {
          ratingId: res.rating_id,
          orderId: res.rating_orderId,
          stars: res.rating_stars,
          comment: res.rating_comment,
        },
      }));
    } catch (err) {
      this.logger.error(`Could not get restaurants review ${err}`);
      return null;
    }
  }
}
