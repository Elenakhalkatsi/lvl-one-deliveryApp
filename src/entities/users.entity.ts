import { Role } from 'src/enum/roles.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', {
    length: 100,
  })
  fullName: string;
  @Column('varchar', {
    length: 100,
    unique: true,
  })
  email: string;
  @Column('varchar', {
    length: 100,
    unique: true,
  })
  phoneNumber: string;
  @Column('varchar', {
    length: 100,
  })
  hash: string;
  @Column({ type: 'enum', enum: Role, default: Role.user })
  userRole: Role;
  @Column('boolean')
  deleted: boolean;
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.id, {
    eager: true,
  })
  restaurant: number | RestaurantEntity;
}
