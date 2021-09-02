import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class registerRestaurantDto {
  @IsString()
  name: string;
  @IsString()
  phoneNumber: string;
  @IsEmail()
  email: string;
  @IsString()
  address: string;
  @IsNumber()
  @IsOptional()
  manager: number;
}
