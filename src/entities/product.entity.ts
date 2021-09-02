import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { length: 100, nullable: false })
  productName: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0, nullable: false })
  price: number;
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.id)
  restaurant: number | RestaurantEntity;
  @Column('boolean', { default: false })
  deleted: boolean;
}
