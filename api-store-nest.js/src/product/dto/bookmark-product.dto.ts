import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class BookmarkProductDto {
  @IsNotEmpty({ message: 'Product id is required' })
  @IsNumber({}, { message: 'Product id must be a number' })
  @IsInt({ message: 'Product id must be a integer' })
  productId: number;

  @IsNotEmpty({ message: 'User id is required' })
  @IsNumber({}, { message: 'User id must be a number' })
  @IsInt({ message: 'User id must be a integer' })
  userId: number;
}
