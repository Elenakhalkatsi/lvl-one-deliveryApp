import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { RestaurantEntity } from './restaurant.entity';

@Entity('productsToOrders')
export class ProductsToOrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => OrderEntity, (order) => order.id)
  order: number | OrderEntity;
  @ManyToOne(() => ProductEntity, (product) => product.id)
  product: number;
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.id)
  restaurant: number | RestaurantEntity;
}
