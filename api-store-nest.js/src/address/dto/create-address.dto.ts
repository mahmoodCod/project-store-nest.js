import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'Privince must be a string' })
  @IsNotEmpty({ message: 'Privince is required' })
  province: string;

  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsString()
  @Length(10, 10, { message: 'Postal_code must be 10 digits' })
  postal_code: string;

  @IsString({ message: 'Reciver_mobile must be a string' })
  @Length(11, 11, { message: 'Reciver_mobile must be a 11 digits' })
  reciver_mobile: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;
}
