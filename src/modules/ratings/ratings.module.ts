import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RatingsRepositoryModule } from 'src/repositories/rating/rating.module';
import { OrdersModule } from '../orders/orders.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

@Module({
  imports: [
    AuthModule,
    RatingsRepositoryModule,
    RestaurantsModule,
    OrdersModule,
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
//need this in other branches
