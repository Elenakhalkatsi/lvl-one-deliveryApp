import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantsRepositoryModule } from 'src/repositories/restaurants/restaurants.module';
import { UsersModule } from '../users/users.module';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [AuthModule, RestaurantsRepositoryModule, UsersModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
