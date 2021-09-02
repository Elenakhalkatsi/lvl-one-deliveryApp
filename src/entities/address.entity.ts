import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 500,
    default: 'No Address',
  })
  address: string;
  @Column('boolean')
  deleted: boolean;
  @ManyToOne(() => UsersEntity, (user) => user.id)
  user: number | UsersEntity;
}
