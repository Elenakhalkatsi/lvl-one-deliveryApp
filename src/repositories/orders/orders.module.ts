import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsToOrdersEntity } from 'src/entities/products-to-orders.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, ProductsToOrdersEntity])],
  providers: [OrdersRepository],
  exports: [OrdersRepository],
})
export class OrdersRepositoryModule {}
