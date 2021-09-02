import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsOptional()
  @IsString()
  phoneNumber: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  address: string;
  @IsNumber()
  @IsOptional()
  manager: number;
}
