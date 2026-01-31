import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { orderStatus } from '../enum/order-status.enum';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsEnum(orderStatus)
  @IsOptional()
  status?: orderStatus;

  @IsDateString()
  @IsOptional()
  set_time?: Date;

  @IsDateString()
  @IsOptional()
  payed_time?: Date;

  @IsNumber()
  addressId: number;

  @IsNumber()
  total_price: number;

  @IsNumber()
  @IsOptional()
  discount_code?: number;
}
