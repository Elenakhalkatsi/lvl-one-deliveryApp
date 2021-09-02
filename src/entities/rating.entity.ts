import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { RestaurantEntity } from './restaurant.entity';

@Entity('ratings')
@Unique(['order'])
export class RatingEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int', { nullable: false })
  stars: number;
  @Column('varchar', { length: 300, nullable: false })
  comment: string;
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.rating)
  restaurant: number | RestaurantEntity;
  @OneToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn()
  order: number | OrderEntity;
}
