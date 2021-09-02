import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/enum/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
