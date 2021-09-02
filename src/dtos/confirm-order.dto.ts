import { IsBoolean } from 'class-validator';

export class ConfirmOrderDto {
  @IsBoolean()
  isConfirmed: boolean;
}
