import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class MakeOrderDto {
  @IsString()
  address: string;
  @IsNumber()
  restaurant: number;
  @IsInt({
    each: true,
  })
  products: number[];
  @IsString()
  @IsOptional()
  orderTime: string;
}
