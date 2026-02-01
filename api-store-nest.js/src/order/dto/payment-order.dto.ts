import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;
}
