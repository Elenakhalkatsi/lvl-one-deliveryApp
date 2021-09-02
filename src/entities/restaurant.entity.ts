import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RatingEntity } from './rating.entity';
import { UsersEntity } from './users.entity';

@Entity('restaurants')
@Unique(['email'])
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { length: 100, nullable: false })
  restaurantName: string;
  @Column('varchar', { nullable: false })
  phoneNumber: string;
  @Column('varchar', { length: 70, nullable: false })
  email: string;
  @Column('varchar', { nullable: false })
  address: string;
  @Column('boolean', { default: false, nullable: false })
  deleted: boolean;
  @OneToMany(() => UsersEntity, (user) => user.id)
  manager: number | UsersEntity;
  @OneToMany(() => RatingEntity, (rating) => rating.restaurant)
  rating: number | RatingEntity;
  @Column('int', { default: 0 })
  averageRating: number;
}
