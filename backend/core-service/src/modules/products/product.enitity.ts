import { Column, Entity } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber, IsInt, Min, MaxLength, IsEnum } from 'class-validator';
import { BaseEntity } from '../../common';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports',
  OTHER = 'other'
}
@Entity()
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;

  @Column({ type: 'int' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity!: number;

  @Column({ 
    type: 'enum', 
    enum: ProductCategory,
    default: ProductCategory.OTHER 
  })
  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category!: ProductCategory;

  @Column({ type: 'uuid' })
  @IsNotEmpty()
  @IsString()
  sellerId!: string;
}
