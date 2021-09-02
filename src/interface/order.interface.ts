import { DishEntity } from 'src/entities/dish.entity';
import { RestaurantEntity } from 'src/entities/restaurant.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { OrderStatus } from 'src/enum/order-status.enum';

export interface order {
  id?: number;
  date?: string;
  status: OrderStatus;
  address: string;
  customer?: number | UsersEntity;
  restaurant?: number | RestaurantEntity;
  dishes: number | DishEntity[];
}
