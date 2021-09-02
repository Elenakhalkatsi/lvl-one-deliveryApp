import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingEntity } from 'src/entities/rating.entity';
import { RatingsRepository } from './rating.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity])],
  providers: [RatingsRepository],
  exports: [RatingsRepository],
})
export class RatingsRepositoryModule {}
