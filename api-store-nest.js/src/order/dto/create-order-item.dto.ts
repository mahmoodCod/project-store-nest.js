import { IsNotEmpty, IsNumber } from 'class-validator';

export class createOrderItemDto {
  @IsNumber({}, { message: 'productId must be a number' })
  @IsNotEmpty({ message: 'productId is not empty' })
  productId: number;
}
