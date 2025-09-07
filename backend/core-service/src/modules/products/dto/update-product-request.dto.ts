import { IsOptional, IsString, IsNumber, IsInt, Min, MaxLength, IsEnum } from 'class-validator';
import { ProductCategory } from '../product.enitity';

export class UpdateProductRequest {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  constructor(partial?: Partial<UpdateProductRequest>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
