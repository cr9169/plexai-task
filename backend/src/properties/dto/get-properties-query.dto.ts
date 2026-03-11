import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PAGINATION } from '../../constants';
import { PropertyType } from '../interfaces/property.interface';

export class GetPropertiesQueryDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = PAGINATION.DEFAULT_PAGE;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_LIMIT)
  @Type(() => Number)
  limit: number = PAGINATION.DEFAULT_LIMIT;
}

export type PropertyFilters = Pick<GetPropertiesQueryDto, 'city' | 'type' | 'minPrice' | 'maxPrice'>;
