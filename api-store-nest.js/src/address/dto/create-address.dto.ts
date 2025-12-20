import { IsNotEmpty, IsString, Length } from 'class-validator';

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
}
