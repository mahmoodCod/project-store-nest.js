import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsInt({ message: 'Price must be a number' })
  price: number;

  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsInt({ message: 'Stock must be a number' })
  stock: number;

  @IsOptional()
  @IsArray({ message: 'Category ids must be an array' })
  categoryIds: number;
}
