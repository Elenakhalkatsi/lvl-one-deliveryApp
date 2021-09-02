import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Managers2RestaurantsEntity } from 'src/entities/managers-to-restaurants.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, Managers2RestaurantsEntity]),
  ],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersRepositoryModule {}
