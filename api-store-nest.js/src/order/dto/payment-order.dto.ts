import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  orderId: number;
}
