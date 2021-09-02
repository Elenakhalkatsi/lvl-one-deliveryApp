import { IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  address: string;
}
