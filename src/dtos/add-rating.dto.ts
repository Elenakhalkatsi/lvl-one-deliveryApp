import { IsInt, IsNumber, IsString } from 'class-validator';

export class AddRatingDto {
  @IsInt()
  stars: number;
  @IsNumber()
  restaurant: number;
  @IsString()
  comment: string;
  @IsNumber()
  order: number;
}
