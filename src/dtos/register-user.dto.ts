import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/enum/roles.enum';

export class RegisterUserDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  fullName: string;
  @IsOptional()
  @IsEnum(Role)
  userRole: Role;
  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  phoneNumber: string;
  @IsNumber()
  @IsOptional()
  restaurant: number;
}
