import { RatingEntity } from 'src/entities/rating.entity';
import { UsersEntity } from 'src/entities/users.entity';

export interface Restaurant {
  id?: number;
  restaurantName: string;
  phoneNumber: string;
  email: string;
  address: string;
  deleted?: boolean;
  manager?: number | UsersEntity;
  rating: number | RatingEntity;
}
