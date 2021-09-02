import { OrderEntity } from 'src/entities/order.entity';
import { RestaurantEntity } from 'src/entities/restaurant.entity';

export interface Rating {
  id?: number;
  stars: number;
  restaurant: number | RestaurantEntity;
  comment: string;
  order: number | OrderEntity;
}
