import { IsNotEmpty, IsNumber } from 'class-validator';

export class verifyPayment {
  @IsNumber()
  @IsNotEmpty({ message: 'Track id is required' })
  trackId: number;
}
