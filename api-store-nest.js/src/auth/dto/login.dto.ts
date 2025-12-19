import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class LoginDto {
  @IsString({ message: 'Mobile must be a string' })
  @IsNotEmpty({ message: 'Mobile is required' })
  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/, {
    message: 'Mobile number must be 11 digits',
  })
  @Validate(IsMobilePhone, ['fa-IR'], {
    message: 'Mobile number must be a valid Iranian mobile number',
  })
  @Transform(({ value }) => (value as string).trim())
  mobile: string;

  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
    message: 'Password is required',
  })
  @MinLength(8, { message: 'At least 8-digit body character' })
  @MaxLength(16)
  password: string;
}
