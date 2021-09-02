import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('managersToRestaurants')
export class ManagersToRestaurantsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UsersEntity, (manager) => manager.id)
  manager: number | UsersEntity;
  @Column('int')
  restaurant: number;
}
