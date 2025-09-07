import { IsNotEmpty, IsString, IsNumber, IsInt, Min, MaxLength, IsEnum } from 'class-validator';
import { ProductCategory } from '../product.enitity';

export class CreateProductRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity!: number;

  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category!: ProductCategory;

  constructor(partial?: Partial<CreateProductRequest>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
