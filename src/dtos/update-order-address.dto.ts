import { IsString } from 'class-validator';

export class UpdateOrderAddressDto {
  @IsString()
  address: string;
}
