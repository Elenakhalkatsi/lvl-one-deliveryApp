import { IsNumber, IsString } from 'class-validator';
import { RestaurantEntity } from 'src/entities/restaurant.entity';

export class AddProductDto {
  @IsString()
  productName: string;
  @IsNumber()
  price: number;
  @IsNumber()
  restaurant: number | RestaurantEntity;
}
