import { RestaurantEntity } from 'src/entities/restaurant.entity';

export interface Product {
  id?: number;
  name: string;
  price: number;
  restaurant?: number | RestaurantEntity;
  deleted?: 'boolean';
}
