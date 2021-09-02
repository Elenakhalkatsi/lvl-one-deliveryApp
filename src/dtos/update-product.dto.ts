import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsNumber()
  @IsOptional()
  price: number;
}
