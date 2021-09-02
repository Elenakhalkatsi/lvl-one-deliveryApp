import { IsOptional } from 'class-validator';
import { time } from 'console';
import { OrderStatus } from 'src/enum/order-status.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductEntity } from './product.entity';
import { RestaurantEntity } from './restaurant.entity';
import { UsersEntity } from './users.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { nullable: false })
  @IsOptional()
  date: string;
  @Column('enum', { enum: OrderStatus, nullable: false })
  status: OrderStatus;
  @Column('varchar', { nullable: false })
  address: string;
  @ManyToOne(() => UsersEntity, (user) => user.id, {
    nullable: false,
    eager: true,
  })
  customer: number | UsersEntity;
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.id, {
    eager: true,
  })
  restaurant: number | RestaurantEntity;
  @OneToMany(() => ProductEntity, (product) => product.id)
  products: number[] | ProductEntity[];
  @Column('decimal', { nullable: false })
  price: number;
  @Column('boolean', { default: false, nullable: false })
  deleted: boolean;
}
