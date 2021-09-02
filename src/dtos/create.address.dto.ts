import { IsInt, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  address: string;
  @IsInt()
  user: number;
}
