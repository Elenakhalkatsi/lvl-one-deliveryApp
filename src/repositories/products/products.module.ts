import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductsRepository],
  exports: [ProductsRepository],
})
export class ProductsRepositoryModule {}
