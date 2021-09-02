import { UsersEntity } from 'src/entities/users.entity';

export interface Address {
  id: number;
  address: string;
  deleted?: boolean;
  user?: number | UsersEntity;
}
