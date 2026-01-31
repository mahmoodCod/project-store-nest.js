import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { orderStatus } from '../enum/order-status.enum';

export class CreateOrderDto {
  @IsNumber({}, { message: 'userId must be a number' })
  userId: number;

  @IsEnum(orderStatus, {
    message: 'status must be one of the following values',
  })
  @IsOptional()
  status?: orderStatus;

  @IsDateString({}, { message: 'set_time must be a valid ISO date string' })
  @IsOptional()
  set_time?: Date;

  @IsDateString({}, { message: 'payed_time must be a valid ISO date string' })
  @IsOptional()
  payed_time?: Date;

  @IsNumber({}, { message: 'addressId must be a number' })
  addressId: number;

  @IsNumber({}, { message: 'total_price must be a number' })
  total_price: number;

  @IsNumber({}, { message: 'discount_code must be a number' })
  @IsOptional()
  discount_code?: number;
}
