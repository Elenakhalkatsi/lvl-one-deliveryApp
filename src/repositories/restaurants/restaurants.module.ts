import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from 'src/entities/restaurant.entity';
import { RestaurantsRepository } from './restaurants.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [RestaurantsRepository],
  exports: [RestaurantsRepository],
})
export class RestaurantsRepositoryModule {}
