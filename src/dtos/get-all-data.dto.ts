import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SortDir } from 'src/enum/sort-dir.enum';

export class GetAllDataDto {
  @IsString()
  @IsOptional()
  @Type(() => {
    return String;
  })
  searchBy?: string;
  @IsNumber()
  @IsOptional()
  @Type(() => {
    return Number;
  })
  page?: number;
  @Type(() => {
    return Number;
  })
  @IsNumber()
  @IsOptional()
  limit?: number;
  @IsString()
  @IsOptional()
  sortBy?: string;
  @IsString()
  @IsOptional()
  sortDir?: SortDir;
  @IsString()
  @IsOptional()
  search?: string;
}
